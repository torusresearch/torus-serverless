const config = require("./mongofile");
const dbConfig = process.env.NODE_ENV === "production" ? config.production : process.env.NODE_ENV === "staging" ? config.staging : config.development;
module.exports = dbConfig;
