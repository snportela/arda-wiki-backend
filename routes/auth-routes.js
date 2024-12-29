const pool = require("../server_config");
const { Router, application } = require("express");
const router = Router();

const jwt = require("jsonwebtoken");
const jwtTokens = require("../utils/jwt-helpers.js");
const bcrypt = require("bcrypt");
const decryptPassword = require("../utils/decrypt.js");

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

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

    let tokens = jwtTokens(users.rows[0]);
    res.status(200).json({ token: tokens.accessToken});
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.get("/refresh_token", (req, res) => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken == null)
      return res.status(401).json({ error: "null refresh token" });
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, user) => {
        if (error) return res.status(403).json({ error: error.message });
        let tokens = jwtTokens(user);
        localStorage.setItem("refresh_token", tokens.refreshToken);
        res.json(tokens);
      }
    );
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.delete("/refresh_token", (req, res) => {
  try {
    localStorage.removeItem("refresh_token");
    return res.status(200).json({ message: "refresh token deleted" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
