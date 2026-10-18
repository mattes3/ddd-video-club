import { initKnexAndObjection } from '@ddd-video-club-v2/database';
import { configure, getConsoleSink, getLogger } from '@logtape/logtape';
import { Model } from 'objection';

import { connectToEventBus } from '@ddd-video-club-v2/event-bus';
import { DiscountCampaignRepositoryImpl } from './adapter/persistence/DiscountCampaignRepositoryImpl';
import { getPricingAppService } from './domainmodel/PricingAppService';
import { PricingServiceImpl } from './domainmodel/PricingService';

const logger = getLogger(['pricing']);

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

        const appService = getPricingAppService({
            transact: DiscountCampaignRepositoryImpl,
            eventBus: await connectToEventBus(),
            pricingService: PricingServiceImpl,
        });

        await appService.consumeMovieRented();

        logger.debug(`Pricing Dev server listening for events`);
    } catch (error: unknown) {
        logger.error('Pricing devServer error: {error}', { error });
    }
}

server().catch(error => logger.error('Unexpected error: {error}', { error }));
