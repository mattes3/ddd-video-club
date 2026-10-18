import { accessLog } from '@ddd-video-club-v2/web-ui';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import type { MovieAppService } from '../../domainmodel/MovieAppService';
import { pages } from './pages';
import { router } from './router';

export function api(appService: MovieAppService) {
    const server = new Hono();

    server.use(accessLog('movies'));
    server.use('/api/*', cors());

    server.route('/api/movies', router(appService));
    server.route('/', pages(appService));

    return server;
}

export default api;
