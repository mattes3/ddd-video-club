/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            database: process.env.DATABASE_NAME || 'videoclubdb',
            host: process.env.DATABASE_HOST || 'localhost',
            port: parseInt(process.env.DATABASE_PORT || '5432'),
            user: process.env.DATABASE_USER || 'videoclub',
            password: process.env.DATABASE_PASSWORD || 'videoclubpassword',
            ssl: false,
        },
        migrations: {
            directory: 'knex/migrations',
            tableName: 'knex_migrations',
        },
    },
};
