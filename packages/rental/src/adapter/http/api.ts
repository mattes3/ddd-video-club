import { accessLog } from '@ddd-video-club-v2/web-ui';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import type { RentalAppService } from '../../domainmodel/RentalAppService';
import { pages } from './pages';
import { router } from './router';

export function api(appService: RentalAppService) {
    const server = new Hono();

    server.use(accessLog('rental'));
    server.use('/api/*', cors());

    server.route('/api/rentals', router(appService));
    server.route('/rentals', pages(appService));

    return server;
}

export default api;
