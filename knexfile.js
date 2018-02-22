

var config = require('./server/config');
var knex = {
  client: config.connection.client,
  connection: {
    host     : config.connection.host,
    user     : config.connection.user,
    password : config.connection.password,
    database : config.connection.database,
    charset  : config.connection.charset,
    timezone : "UTC"
  }
}


module.exports = knex;