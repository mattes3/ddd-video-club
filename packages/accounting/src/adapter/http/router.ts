import { getLogger } from '@logtape/logtape';
import { CURRENT_CUSTOMER_ID, nocache } from '@ddd-video-club-v2/web-ui';
import { Hono } from 'hono';
import type { AccountAppService } from '../../domainmodel/AccountAppService';

const logger = getLogger(['accounting', 'http']);

export function router(appService: AccountAppService) {
    const r = new Hono();

    r.use(nocache());

    // a test endpoint
    r.get('/ping', c => c.text('Pong!'));

    // endpoint that gives an overview for the account of the logged-in user
    r.get('/myaccount', async c => {
        try {
            const accountOverview = await appService.accountOverviewForCustomer(CURRENT_CUSTOMER_ID);

            if (accountOverview) {
                return c.json(accountOverview);
            } else {
                return c.text('no such account', 404);
            }
        } catch (error: unknown) {
            logger.error('internal error while getting an account overview: {error}', { error });
            return c.text('internal error', 500);
        }
    });

    return r;
}
