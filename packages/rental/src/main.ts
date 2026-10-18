import { initKnexAndObjection } from '@ddd-video-club-v2/database';
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
        await initKnexAndObjection();

        const appService = getRentalAppService({
            transact: RentalRepositoryImpl,
            eventBus: await connectToEventBus(),
        });

        const port = process.env.PORT ?? 4001;
        api(appService).listen(port);

        logger.debug(`Rental API Dev server listening on port ${port}`);
    } catch (error: unknown) {
        logger.error('Rental API devServer error: {error}', { error });
    }
}

server().catch(error => logger.error('Unexpected error: {error}', { error }));
