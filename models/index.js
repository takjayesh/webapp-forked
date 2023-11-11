const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
     {
       host: process.env.MYSQL_HOST,
       dialect: process.env.MYSQL_DIALECT
     }
   );

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Assignment = require("./assignModel.js")(sequelize, Sequelize);
db.User = require("./userModel.js")(sequelize, Sequelize);

db.User.hasMany(db.Assignment);

db.databaseCheck = async function() {
  try {
      await sequelize.authenticate();
      await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE}`);
      console.log("Database ensured");
  } catch (err) {
     console.error('Unable to ensure the database:', error);
     res.status(500).send('Error ensuring the database.');
  }
};


//Adding new code for database connection

// Database check function

// db.databaseCheck = async function() {
//     try {
//         await sequelize.authenticate();
//         await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE}`);
//         console.log("Database ensured");
//     } catch (err) {
//         console.log(err);
//     }
// };


module.exports = db;