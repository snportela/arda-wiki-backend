const express = require("express");
const pool = require("../server_config");
const { Router, application } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const authenticateToken = require("../middleware/authorization.js");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json({ users: users.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [req.body.name, req.body.email, hashedPassword]
    );
    res.json({ users: newUser.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
