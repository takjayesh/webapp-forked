const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const app = express();
const db = require("./models");
const authorization = require("./middleware/authorization");
const { getStatsD, endStatsD } = require('./statsd/statsd');
const port =  5000;

app.use(getStatsD());

db.databaseCheck();

app.use(express.json());
app.use("/healthz", require("./routes/healthzRoutes"));

db.sequelize.sync({force:false})
  .then(() => {
    const createUser = require("./opt/createuser"); // Creating users from csv file
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use(authorization)
app.use("/", require("./routes/assignRoutes"));

app.use(endStatsD());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Catch all error handler
module.exports = app;

