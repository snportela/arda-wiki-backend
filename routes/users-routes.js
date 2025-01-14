const express = require("express");
const pool = require("../server_config");
const { Router, application } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const authenticateToken = require("../middleware/authorization.js");
const decryptPassword = require("../utils/decrypt.js");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json({ users: users.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const results = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    if (results.rows.length === 0) {
      throw "User not found";
    }
    // res.status(200).json(results.rows[0]);
    res
      .status(200)
      .json({
        user_id: results.rows[0].user_id,
        name: results.rows[0].name,
        email: results.rows[0].email,
      });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(
      decryptPassword(req.body.password),
      10
    );
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

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    pool.query("DELETE FROM users WHERE user_id = $1", [id]);
    res.status(200).json({ message: `Deleted user with ID: ${id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
