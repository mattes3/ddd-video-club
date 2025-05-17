import { initKnexAndObjection } from '@ddd-video-club-v2/database';
import { logger } from 'express-wolox-logger';

import { connectToEventBus } from '@ddd-video-club-v2/event-bus';
import api from './adapter/http/api';
import { RentalRepositoryImpl } from './adapter/persistence/RentalRepositoryImpl';
import { getRentalAppService } from './domainmodel/RentalAppService';

async function server() {
    try {
        await initKnexAndObjection();

        const appService = getRentalAppService({
            transact: RentalRepositoryImpl,
            eventBus: await connectToEventBus(),
        });

        const port = process.env.PORT ?? 4001;
        api(appService).listen(port);

        return `Rental API Dev server listening on port ${port}`;
    } catch (error: unknown) {
        logger.error('Rental API devServer error', error);
    }
}

server().then(console.log).catch(console.error);
