const { Router } = require("express");
const router = Router();

const pool = require("../server_config");

const authenticateToken = require("../middleware/authorization.js");

router.get("/", async (req, res) => {
  try {
    let query = "SELECT * FROM periods WHERE period_id IS NOT NULL";
    let params = [];

    const search = req.query.search;
    const limit = req.query.limit;
    const order = req.query.order;
    const sort = req.query.sort;

    if (req.query.length === 0) {
      query = "SELECT * FROM periods";
    }

    if (search) {
      query += " AND unaccent(name) ilike unaccent('%" + search + "%')";
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
      "SELECT * FROM periods WHERE period_id = $1",
      [id]
    );
    if (results.rows.length === 0) {
      throw "Period not found";
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    await pool.query(
      "INSERT INTO periods (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.status(201).json({ periods: req.body });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    await pool.query(
      "UPDATE periods SET name = $1, description = $2 WHERE period_id = $3",
      [name, description, id]
    );
    res.status(200).json({ periods: req.body });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await pool.query("DELETE FROM periods WHERE period_id = $1", [id]);
    res.status(200).send({ message: `Deleted period with ID: ${id}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
