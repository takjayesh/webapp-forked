const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const app = express();
const db = require("./models");
const authorization = require("./middleware/authorization");
//const createUser = require("./opt/createuser"); // Creating users from csv file
//const statsd = require('./statsd/statsd');
const { getStatsD, endStatsD } = require('./statsd/statsd');
const port =  5000;

app.use(getStatsD);

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

app.use(endStatsD);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


module.exports = app;


// db.databaseCheck()
//     .then(() => {
//       db.sequelize.authenticate();
//     })
//     .catch(err => {
      
//     });


//Middleware to check the database connection
// app.use(async (req, res, next) => {
//   try {
//     await db.sequelize.authenticate();  
//     await db.databaseCheck();
//       next();
//   } catch (error) {
//       console.error('Unable to ensure the database:', error);
//       res.status(500).send('Error ensuring the database.');
//   }
// });


// db.databaseCheck = async function() {
//   try {
//       await sequelize.authenticate();
//       await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE}`);
//       console.log("Database ensured");
//   } catch (err) {
//       console.log(err);
//   }
// };


