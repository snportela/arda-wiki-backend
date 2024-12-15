const { Router } = require("express");
const router = Router();

const pool = require("../server_config");

const authenticateToken = require("../middleware/authorization.js");

router.get("/", async (req, res) => {
  try {
    let query = "SELECT * FROM events WHERE event_id IS NOT NULL";
    let params = [];

    const date = req.query.date;
    const period = req.query.period_id;
    const search = req.query.search;
    const limit = req.query.limit;
    const order = req.query.order;
    const sort = req.query.sort;

    if (req.query.length === 0) {
      query = "SELECT * FROM events";
    }

    if (search) {
      query += " AND unaccent(name) ilike unaccent('%" + search + "%')";
    }

    if (date) {
      params.push(date);
      query += " AND date =  $" + params.length;
    }
    if (period) {
      params.push(period);
      query += " AND period_id = $" + params.length;
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
      `select events.*, periods.name as period
      from events left join periods 
      on periods.period_id = any (events.period_id) WHERE event_id = $1`,
      [id]
    );
    if (results.rows.length === 0) {
      throw "Event not found";
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, date, description, period_id } = req.body;

    const results = await pool.query(
      "INSERT INTO events (name, date, description, period_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, date, description, period_id]
    );
    res.status(201).send(`Event created with ID: ${results.rows[0].event_id}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, date, description, period_id } = req.body;

    const results = await pool.query(
      "UPDATE events SET name = $1, date = $2, description = $3, period_id = $4 WHERE event_id = $5",
      [name, date, description, period_id, id]
    );
    res.status(200).send(`Updated event with ID: ${id}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const results = await pool.query("DELETE FROM events WHERE event_id = $1", [
      id,
    ]);
    res.status(200).send(`Deleted event with ID: ${id}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
