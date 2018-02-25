
exports.up = function(knex, Promise) {
  //return Promise.all([knex.schema.raw('create unique index on user_friends ( sort( array[user_id, friend_id ] ) );')]);
};

exports.down = function(knex, Promise) {
  
};
