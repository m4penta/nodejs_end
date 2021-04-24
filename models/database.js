const { Sequelize } = require('sequelize');
// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize('dbmanager', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });

  db.authenticate()
        .then(() => {
            console.log('connect server sucessfull!!!');
        });
module.exports = db;