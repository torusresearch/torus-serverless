// Update with your config settings.

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: encodeURIComponent(process.env.PS_HOST),
      database: encodeURIComponent(process.env.PS_DATABASE),
      port: encodeURIComponent(process.env.PS_PORT),
      user: encodeURIComponent(process.env.PS_USERNAME),
      password: encodeURIComponent(process.env.PS_PASSWORD)
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  staging: {
    client: "postgresql",
    connection: {
      host: encodeURIComponent(process.env.PS_HOST),
      database: encodeURIComponent(process.env.PS_DATABASE),
      port: encodeURIComponent(process.env.PS_PORT),
      user: encodeURIComponent(process.env.PS_USERNAME),
      password: encodeURIComponent(process.env.PS_PASSWORD)
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      host: encodeURIComponent(process.env.PS_HOST),
      database: encodeURIComponent(process.env.PS_DATABASE),
      port: encodeURIComponent(process.env.PS_PORT),
      user: encodeURIComponent(process.env.PS_USERNAME),
      password: encodeURIComponent(process.env.PS_PASSWORD)
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};
