import { initPersistence } from '@ddd-video-club-v2/database';
import { configure, getConsoleSink, getLogger } from '@logtape/logtape';

import { connectToEventBus } from '@ddd-video-club-v2/event-bus';
import api from './adapter/http/api';
import { AccountRepositoryImpl } from './adapter/persistence/AccountRepositoryImpl';
import { getAccountAppService } from './domainmodel/AccountAppService';

const logger = getLogger(['accounting']);

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

        const appService = getAccountAppService({
            transact: AccountRepositoryImpl,
            eventBus: await connectToEventBus(),
        });

        await appService.consumeMovieRentalPriced();

        const port = process.env.PORT ?? 4002;
        api(appService).listen(port);

        logger.debug(`Account API Dev server listening on port ${port}`);
    } catch (error: unknown) {
        logger.error('Account API devServer error: {error}', { error });
    }
}

server().catch(error => logger.error('Unexpected error: {error}', { error }));
