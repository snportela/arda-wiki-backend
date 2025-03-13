const { Router } = require("express");
const router = Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const authenticateToken = require("../middleware/authorization.js");
const pool = require("../server_config");

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
    let query = "SELECT * FROM characters WHERE character_id IS NOT NULL";
    let params = [];

    const race = req.query.race_id;
    const location = req.query.location_id;
    const weapon = req.query.weapon_id;
    const search = req.query.search;
    const limit = req.query.limit;
    const order = req.query.order;
    const sort = req.query.sort;

    if (req.query.length === 0) {
      query = "SELECT * FROM characters";
    }

    if (search) {
      query += " AND unaccent(name) ilike unaccent('%" + search + "%')";
    }

    if (race) {
      params.push(race);
      query += " AND race_id = $" + params.length;
    }

    if (location) {
      params.push(location);
      query += " AND location_id = $" + params.length;
    }

    if (weapon) {
      params.push(weapon);
      query += " AND weapon_id = $" + params.length;
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
      `SELECT characters.*, array_agg(locations.name)::varchar as location, races.name as race, array_agg(distinct weapons.name)::varchar as weapon
      FROM characters left JOIN LOCATIONS 
      ON locations.location_id = any (characters.location_id)
      left join races 
      on characters.race_id = races.race_id
      left join weapons 
      on weapons.weapon_id = any (characters.weapon_id) where character_id = $1
      group by characters.character_id, races.name`,
      [id]
    );
    if (results.rows.length === 0) {
      throw "Character not found";
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
    const filename =
      "https://arda-wiki-api.onrender.com/api/images/" + req.file.filename;

    const { name, description, race_id, location_id, weapon_id } = req.body;
    const parse_location = JSON.parse(location_id);
    const parse_weapon = JSON.parse(weapon_id);

    try {
      await pool.query(
        "INSERT INTO characters (name, description, race_id, location_id, weapon_id, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [name, description, race_id, parse_location, parse_weapon, filename]
      );
      res.status(201).json({ characters: req.body });
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
      const { name, description, race_id, location_id, weapon_id } = req.body;
      const parse_location = JSON.parse(location_id);
      const parse_weapon = JSON.parse(weapon_id);

      const results = await pool.query(
        "SELECT * FROM characters WHERE character_id = $1",
        [id]
      );
      const current_character = results.rows[0];
      let filename = current_character.image;

      if (!req.body.image && current_character.image) {
        filename = null;

        const imagePath = current_character.image;
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
      }

      if (req.file) {
        filename =
          "https://arda-wiki-api.onrender.com/api/images/" + req.file.filename;
      }

      pool.query(
        "UPDATE characters SET name = $1, description = $2, race_id = $3, location_id = $4, weapon_id = $5, image = $6 WHERE character_id = $7",
        [name, description, race_id, parse_location, parse_weapon, filename, id]
      );
      res.status(200).json({ characters: req.body });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const results = await pool.query(
      "SELECT image FROM characters WHERE character_id = $1",
      [id]
    );
    const current_character = results.rows[0];

    const imagePath = current_character.image;
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

    await pool.query("DELETE FROM characters WHERE character_id = $1", [id]);
    res.status(200).json({ message: `Deleted character with ID: ${id}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
