import { initKnexAndObjection } from '@ddd-video-club-v2/database';
import { logger } from 'express-wolox-logger';
import { Model } from 'objection';

import { connectToEventBus } from '@ddd-video-club-v2/event-bus';
import { DiscountCampaignRepositoryImpl } from './adapter/persistence/DiscountCampaignRepositoryImpl';
import { getPricingAppService } from './domainmodel/PricingAppService';
import { PricingServiceImpl } from './domainmodel/PricingService';

async function server() {
    try {
        await initKnexAndObjection();

        const appService = getPricingAppService({
            transact: DiscountCampaignRepositoryImpl,
            eventBus: await connectToEventBus(),
            pricingService: PricingServiceImpl,
        });

        await appService.consumeMovieRented();

        return `Pricing Dev server listening for events`;
    } catch (error: unknown) {
        logger.error('Pricing devServer error', error);
    }
}

server().then(console.log).catch(console.error);
