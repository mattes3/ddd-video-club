import { nocache } from '@ddd-video-club-v2/web-ui';
import { Hono } from 'hono';
import type { MovieAppService } from '../../domainmodel/MovieAppService';

export function router(appService: MovieAppService) {
    const r = new Hono();

    r.use(nocache());

    r.get('/ping', c => c.text('Pong!'));

    r.get('/', async c => c.json(await appService.findMoviesToSelectFrom()));

    r.get('/:id', async c => {
        const movie = await appService.findMovieForViewing(c.req.param('id'));

        if (movie) {
            return c.json(movie);
        } else {
            return c.text('no such movie', 404);
        }
    });

    return r;
}
