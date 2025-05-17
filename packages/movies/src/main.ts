import { logger } from 'express-wolox-logger';
import { Model } from 'objection';
import { initKnexAndObjection } from '@ddd-video-club-v2/database';

import api from './adapter/http/api';
import { MovieRepositoryImpl } from './adapter/persistence/MovieRepositoryImpl';
import { getMovieAppService } from './domainmodel/MovieAppService';

async function server() {
    try {
        await initKnexAndObjection();

        const appService = getMovieAppService(MovieRepositoryImpl);
        const port = process.env.PORT ?? 4000;

        api(appService).listen(port);

        return `Movie API Dev server listening on port ${port}`;
    } catch (error: unknown) {
        logger.error('Movie API devServer error', error);
    }
}

server().then(console.log).catch(console.error);
