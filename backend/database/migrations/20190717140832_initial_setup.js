exports.up = function(knex) {
  return knex.schema
    .createTable("user", function(table) {
      table.increments("id");
      table
        .string("public_address", 255)
        .notNullable()
        .unique();
      table
        .string("default_currency", 255)
        .notNullable()
        .defaultTo("USD");
      table
        .boolean("is_new")
        .notNullable()
        .defaultTo(false);
    })
    .createTable("transactions", function(table) {
      table.increments("id");
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.fn.now());
      table.string("from", 255).notNullable();
      table
        .foreign("from")
        .references("public_address")
        .inTable("user");
      table.string("to", 255).notNullable();
      table.string("total_amount", 255).notNullable();
      table.string("currency_amount", 255).notNullable();
      table.string("selected_currency", 255).notNullable();
      table.string("status", 255).notNullable();
      table.string("network", 255).notNullable();
      table.string("transaction_hash", 255).notNullable();
      table.unique(["transaction_hash", "network"]);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable("transactions").dropTable("user");
};
