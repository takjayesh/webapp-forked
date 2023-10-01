const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    'healthcheckdb',
    'root',
    'admin',
     {
       host: 'localhost',
       dialect: 'mysql'
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