const jwt = require("jsonwebtoken");

function jwtTokens({ user_id }) {
  const payload = { user_id };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60m",
  });
  return { accessToken };
}

module.exports = jwtTokens;
