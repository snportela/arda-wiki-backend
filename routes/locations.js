const { Router } = require("express");
const router = Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const pool = require("../server_config");

const authenticateToken = require("../middleware/authorization.js");

const imageUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "images/");
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + "_" + file.originalname);
    },
  }),
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only! (jpeg, jpg, png, gif)");
  }
}

router.get("/", async (req, res) => {
  try {
    let query = "SELECT * FROM locations WHERE location_id IS NOT NULL";
    let params = [];

    const race = req.query.race_id;
    const search = req.query.search;
    const limit = req.query.limit;
    const order = req.query.order;
    const sort = req.query.sort;

    if (req.query.length === 0) {
      query = "SELECT * FROM locations";
    }

    if (search) {
      query += " AND unaccent(name) ilike unaccent('%" + search + "%')";
    }

    if (race) {
      params.push(race);
      query += " AND race_id = $" + params.length;
    }

    if (order) {
      query += ` ORDER BY ` + order;
    }

    if (sort) {
      query += " " + sort;
    }

    if (limit) {
      query += ` LIMIT ` + limit;
    }

    const results = await pool.query(query, params);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const results = await pool.query(
      `SELECT locations.*, array_agg(races.name)::varchar as race
      FROM locations left join races 
      ON races.race_id = any (locations.race_id) WHERE location_id = $1
      GROUP BY locations.location_id`,
      [id]
    );
    if (results.rows.length === 0) {
      throw "Location not found";
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.post(
  "/",
  authenticateToken,
  imageUpload.single("image"),
  async (req, res) => {
    try {
      const filename =
        "https://arda-wiki-api.onrender.com/api/images/" + req.file.filename;

      const { name, description, race_id } = req.body;
      const parse_race = JSON.parse(race_id);

      await pool.query(
        "INSERT INTO locations (name, description, race_id, image) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, description, parse_race, filename]
      );
      res.status(201).json({ locations: req.body });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  imageUpload.single("image"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, description, race_id } = req.body;
      const parse_race = JSON.parse(race_id);

      const results = await pool.query(
        "SELECT * FROM locations WHERE location_id = $1",
        [id]
      );
      const current_location = results.rows[0];
      let filename = current_location.image;

      if (!req.body.image && current_location.image) {
        filename = null;
        const imagePath = current_location.image;
        const dirname = path.resolve();
        const fullfilepath = path.join(
          dirname,
          "images/",
          imagePath.substring(33)
        );

        if (fs.existsSync(fullfilepath)) {
          fs.unlink(fullfilepath, (error, results) => {
            if (error) {
              throw error;
            }
            console.log("file deleted successfully");
          });
        }
      }

      if (req.file) {
        filename =
          "https://arda-wiki-api.onrender.com/api/images/" + req.file.filename;
      }

      pool.query(
        "UPDATE locations SET name = $1, description = $2, race_id = $3, image = $4 WHERE location_id = $5",
        [name, description, parse_race, filename, id]
      );
      res.status(200).json({ locations: req.body });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const results = await pool.query(
      "SELECT * FROM locations WHERE location_id = $1",
      [id]
    );
    const current_location = results.rows[0];

    const imagePath = current_location.image;
    const dirname = path.resolve();
    const fullfilepath = path.join(
      dirname,
      "images/" + imagePath.substring(33)
    );
    if (fs.existsSync(fullfilepath)) {
      fs.unlink(fullfilepath, (error, results) => {
        if (error) {
          throw error;
        }
        console.log("file deleted successfully");
      });
    }

    pool.query("DELETE FROM locations WHERE location_id = $1", [id]);
    res.status(200).json({ message: `Deleted location with ID: ${id}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
