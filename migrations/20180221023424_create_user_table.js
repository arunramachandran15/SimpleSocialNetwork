
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('users', function(table) {
	        table.increments('id').unsigned().primary();
	        table.string('name').notNull();
	        table.string('password').notNull();
	        table.dateTime('created_at').notNull();
	        table.dateTime('updated_at').nullable();
	        table.unique(['name']);
		}),
		knex.schema.createTable('user_friends', function(table){
			table.increments('id').unsigned().primary();																//chocolate//coke//lays
			table.integer('user_id').unsigned().notNull().references('id').inTable('users');
			table.integer('friend_id').unsigned().notNull().references('id').inTable('users');;
			table.timestamps()
		})
	])
}

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('users'),
		knex.schema.dropTable('user_friends'),

	])
}

