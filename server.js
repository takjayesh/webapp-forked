const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const app = express();
const db = require("./models");
//const createUser = require("./opt/createuser");
const authorization = require("./middleware/authorization");

// Middleware to check the database connection
// app.use(async (req, res, next) => {
//   try {
//       await db.databaseCheck();
//       next();
//   } catch (error) {
//       console.error('Unable to ensure the database:', error);
//       res.status(500).send('Error ensuring the database.');
//   }
// });

db.databaseCheck = async function() {
  try {
      await sequelize.authenticate();
      await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE}`);
      console.log("Database ensured");
  } catch (err) {
      console.log(err);
  }
};

//const port = process.env.PORT || 5000;
const port =  5000;

app.use(express.json());
app.use("/healthz", require("./routes/healthzRoutes"));

db.sequelize.sync({force:false})
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use(authorization)

app.use("/api/users", require("./routes/userRoutes"));
app.use("/", require("./routes/assignRoutes"));
//app.use("/api/contacts", require("./routes/contactRoutes"));
//app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


module.exports = app;