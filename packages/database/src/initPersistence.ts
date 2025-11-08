import Knex from 'knex';
import { knexSnakeCaseMappers, Model } from 'objection';

export async function initKnexAndObjection() {
    const knex = Knex({
        client: 'postgresql',
        connection: {
            database: process.env.DATABASE_NAME || 'videoclubdb',
            host: process.env.DATABASE_HOST || 'localhost',
            port: parseInt(process.env.DATABASE_PORT || '5432'),
            user: process.env.DATABASE_USER || 'videoclub',
            password: process.env.DATABASE_PASSWORD || 'videoclubpassword',
            ssl: false,
        },
        pool: {
            min: 0,
            max: 10,
        },
        ...knexSnakeCaseMappers(),
    });

    try {
        const start1 = Date.now();

        // Initialize knex.
        await knex.raw('SELECT 1');
        console.log('Initialized Knex: ', Date.now() - start1);
    } catch (e: unknown) {
        console.error('Error initializing Knex', JSON.stringify(e, undefined, 2));
        return;
    }

    // Give the knex instance to objection.
    Model.knex(knex);
}
