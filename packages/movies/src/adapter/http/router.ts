import express, { Router } from 'express';
import nocache from 'nocache';
import type { MovieAppService } from '../../domainmodel/MovieAppService';

export function router(appService: MovieAppService): Router {
	const r = Router();

	// Parse URL-encoded bodies (as sent by HTML forms)
	r.use(express.urlencoded({ extended: true }));

	// Parse JSON bodies (as sent by API clients)
	r.use(express.json());

	r.get('/ping', nocache(), (_req, res) => res.type('text/plain').send('Pong!'));

	r.get('/', nocache(), async (_req, res) => {
		res.json(await appService.movies());
	});

	r.get('/:id', nocache(), async (req, res) => {
		const movie = await appService.findMovie(req.params.id);

		if (movie) {
			res.json(movie);
		} else {
			res.status(404).send('no such movie');
		}
	});

	return r;
}
