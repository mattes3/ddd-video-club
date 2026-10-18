import { configure, getConsoleSink, getLogger } from '@logtape/logtape';
import { initPersistence } from '@ddd-video-club-v2/database';

import api from './adapter/http/api';
import { MovieRepositoryImpl } from './adapter/persistence/MovieRepositoryImpl';
import { getMovieAppService } from './domainmodel/MovieAppService';

const logger = getLogger(['movies']);

async function server() {
    await configure({
        sinks: { console: getConsoleSink() },
        loggers: [
            { category: ['logtape', 'meta'], lowestLevel: 'warning', sinks: ['console'] },
            { category: [], lowestLevel: 'debug', sinks: ['console'] },
        ],
    });

    try {
        await initPersistence();

        const appService = getMovieAppService(MovieRepositoryImpl);
        const port = process.env.PORT ?? 4000;

        api(appService).listen(port);

        logger.debug(`Movie API Dev server listening on port ${port}`);
    } catch (error: unknown) {
        logger.error('Movie API devServer error: {error}', { error });
    }
}

server().catch(error => logger.error('Unexpected error: {error}', { error }));
