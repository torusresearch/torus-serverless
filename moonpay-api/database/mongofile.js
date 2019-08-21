// Update with your config settings.

module.exports = {
  development: {
    client: "mongo",
    connection: {
      host: process.env.MONGO_DB_HOST,
      database: "moonpay",
      port: 27017,
      user: "",
      password: ""
    }
  }
};
