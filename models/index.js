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


sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
    
module.exports = db;