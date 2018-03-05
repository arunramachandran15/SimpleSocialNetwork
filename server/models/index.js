var config = require('../config');
var knex = require('knex')({
  client: config.connection.client,
  connection: {
    host     : config.connection.host,
    user     : config.connection.user,
    password : config.connection.password,
    database : config.connection.database,
    charset  : config.connection.charset,
    timezone : "UTC",
    port : 5432,
    ssl: true
  },
  pool: {
    min: 1,
    max: 3
  }
});

console.log('DB connection established')
//console.log(knex);

module.exports.knex = knex;
