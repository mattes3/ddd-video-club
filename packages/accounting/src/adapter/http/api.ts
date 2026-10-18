import { accessLog } from '@ddd-video-club-v2/web-ui';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import type { AccountAppService } from '../../domainmodel/AccountAppService';
import { pages } from './pages';
import { router } from './router';

export function api(appService: AccountAppService) {
    const server = new Hono();

    server.use(accessLog('accounting'));
    server.use('/api/*', cors());

    server.route('/api/accounts', router(appService));
    server.route('/account', pages(appService));

    return server;
}

export default api;
