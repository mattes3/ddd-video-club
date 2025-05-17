import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import morgan from 'morgan';

import type { AccountAppService } from '../../domainmodel/AccountAppService';
import { router } from './router';

export function api(appService: AccountAppService) {
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
    server.use('/api/accounts', router(appService));

    return server;
}

export default api;
