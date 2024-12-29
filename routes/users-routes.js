const express = require("express");
const pool = require("../server_config");
const { Router, application } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const authenticateToken = require("../middleware/authorization.js");
const jwt = require("jsonwebtoken");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json({ users: users.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/user_data", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (req.headers && req.headers.authorization) {
    try {
      if (token == null) return res.status(401).json({ error: "Null token" });

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) return res.status(403).json({ error: error.message });

        res.status(200).json(user);
      });
    } catch (error) {
      return res.status(401).send("unauthorized");
    }
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

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;

    const results = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    const current_user = results.rows[0];
    const password = current_user.password;

    pool.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE user_id = $4",
      [name, email, password, id]
    );
    res.status(200).json({ users: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
