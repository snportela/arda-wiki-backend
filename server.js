const express = require("express");
const bp = require("body-parser");

const charactersRoute = require("./routes/characters");
const locationsRoute = require("./routes/locations");
const racesRoute = require("./routes/races");
const eventsRoute = require("./routes/events");
const weaponsRoute = require("./routes/weapons");
const periodsRoute = require("./routes/periods");
const usersRoute = require("./routes/users-routes.js");
const authRoute = require("./routes/auth-routes.js");
const path = require("path");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(`${req.method}:${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/api/images/:filename", (req, res) => {
  const { filename } = req.params;
  const dirname = path.resolve();
  const fullfilepath = path.join(dirname, "images/" + filename);
  return res.sendFile(fullfilepath);
});

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);

app.use("/api/characters", charactersRoute);
app.use("/api/locations", locationsRoute);
app.use("/api/races", racesRoute);
app.use("/api/events", eventsRoute);
app.use("/api/weapons", weaponsRoute);
app.use("/api/periods", periodsRoute);

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
