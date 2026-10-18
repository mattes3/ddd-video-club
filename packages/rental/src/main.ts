import { initPersistence } from '@ddd-video-club-v2/database';
import { configure, getConsoleSink, getLogger } from '@logtape/logtape';

import { connectToEventBus } from '@ddd-video-club-v2/event-bus';
import api from './adapter/http/api';
import { RentalRepositoryImpl } from './adapter/persistence/RentalRepositoryImpl';
import { getRentalAppService } from './domainmodel/RentalAppService';

const logger = getLogger(['rental']);

async function server() {
    await configure({
        sinks: { console: getConsoleSink() },
        loggers: [
            { category: ['logtape', 'meta'], lowestLevel: 'warning', sinks: ['console'] },
            { category: [], lowestLevel: 'debug', sinks: ['console'] },
        ],
    });

    try {
        await initPersistence();

        const appService = getRentalAppService({
            transact: RentalRepositoryImpl,
            eventBus: await connectToEventBus(),
        });

        const port = Number(process.env.PORT ?? 4001);
        Bun.serve({ port, fetch: api(appService).fetch });

        logger.debug(`Rental API Dev server listening on port ${port}`);
    } catch (error: unknown) {
        logger.error('Rental API devServer error: {error}', { error });
    }
}

server().catch(error => logger.error('Unexpected error: {error}', { error }));
