const jwt = require("jsonwebtoken");

function jwtTokens({ user_id, name, email }) {
  const user = { user_id, name, email };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5m",
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  return { accessToken, refreshToken };
}

module.exports = jwtTokens;
