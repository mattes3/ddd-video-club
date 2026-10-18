import { getLogger } from '@logtape/logtape';
import { SQL } from 'bun';

const logger = getLogger(['database']);

let sql: SQL | undefined;

export function createSql(): SQL {
    return new SQL({
        hostname: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        database: process.env.DATABASE_NAME || 'videoclubdb',
        username: process.env.DATABASE_USER || 'videoclub',
        password: process.env.DATABASE_PASSWORD || 'videoclubpassword',
        tls: false,
        max: 10,
    });
}

export function getSql(): SQL {
    if (!sql) {
        throw new Error('Persistence is not initialized, call initPersistence() first');
    }
    return sql;
}

export async function initPersistence() {
    const candidate = createSql();

    try {
        const start = Date.now();
        await candidate`SELECT 1`;
        logger.debug('Initialized database connection in {elapsedMs} ms', {
            elapsedMs: Date.now() - start,
        });
    } catch (e: unknown) {
        logger.error('Error initializing database connection: {error}', { error: e });
        return;
    }

    sql = candidate;
}
