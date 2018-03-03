exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("rsvps", function(table) {
      table.increments();
      table.string("name");
      table.string("email").unique();
      table.string("words");
      table.boolean("approved").defaultTo(false);
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("rsvps")]);
};
