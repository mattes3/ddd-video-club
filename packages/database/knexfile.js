/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    development: {
        client: "postgresql",
        connection: {
            database: "videoclubdb",
            host: "localhost",
            port: 5432,
            user: "videoclub",
            password: "videoclubpassword",
            ssl: false,
        },
        migrations: {
            directory: "knex/migrations",
            tableName: "knex_migrations",
        },
    },
};
