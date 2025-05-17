import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import morgan from 'morgan';

import type { MovieAppService } from '../../domainmodel/MovieAppService';
import { router } from './router';

export function api(appService: MovieAppService) {
    const server = express();

    server.use(
        morgan(
            '[:date[iso]] ACCESS :method :url  :status  :response-time ms - :res[content-length]',
        ),
    );

    server.use(compression());
    server.use(cors());
    server.use(cookieParser());

    // router must be last so that the above middleware can do its job first
    server.use('/api/movies', router(appService));

    return server;
}

export default api;
