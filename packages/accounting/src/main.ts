import { initKnexAndObjection } from '@ddd-video-club-v2/database';
import { logger } from 'express-wolox-logger';
import { Model } from 'objection';

import { connectToEventBus } from '@ddd-video-club-v2/event-bus';
import api from './adapter/http/api';
import { AccountRepositoryImpl } from './adapter/persistence/AccountRepositoryImpl';
import { getAccountAppService } from './domainmodel/AccountAppService';

async function server() {
    try {
        await initKnexAndObjection();

        const appService = getAccountAppService({
            transact: AccountRepositoryImpl,
            eventBus: await connectToEventBus(),
        });

        await appService.consumeMovieRentalPriced();

        const port = process.env.PORT ?? 4002;
        api(appService).listen(port);

        return `Account API Dev server listening on port ${port}`;
    } catch (error: unknown) {
        logger.error('Account API devServer error', error);
    }
}

server().then(console.log).catch(console.error);
