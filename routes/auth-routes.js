const pool = require("../server_config");
const { Router, application } = require("express");
const router = Router();

const jwtTokens = require("../utils/jwt-helpers.js");
const bcrypt = require("bcrypt");
const decryptPassword = require("../utils/decrypt.js");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (users.rows.length === 0)
      return res.status(401).json({ error: "Incorrect email or password" });

    const validPassword = bcrypt.compare(
      decryptPassword(password),
      users.rows[0].password
    );
    if (!validPassword)
      return res.status(401).json({ error: "Incorrect email or password" });

    let tokens = jwtTokens({ user_id: users.rows[0].user_id });
    res.status(200).json({ token: tokens.accessToken });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
