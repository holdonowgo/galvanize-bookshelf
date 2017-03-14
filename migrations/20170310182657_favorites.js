exports.up = function(knex, Promise) {
    return knex.schema.createTable('favorites', (table) => {
        table.increments('id').primary();
        table.integer('user_id').references('users.id').onDelete('CASCADE').notNullable();
        table.integer('book_id').references('books.id').onDelete('CASCADE').notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('favorites');
};
