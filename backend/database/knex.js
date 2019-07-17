const config = require("./knexfile");
const dbConfig = process.env.NODE_ENV === "production" ? config.production : process.env.NODE_ENV === "staging" ? config.staging : config.development;
const knex = require("knex")(dbConfig);

module.exports = knex;
