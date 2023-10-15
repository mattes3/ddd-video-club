import express, { Router } from 'express';
import { logger } from 'express-wolox-logger';
import nocache from 'nocache';
import type { AccountAppService } from '../../domainmodel/AccountAppService';

const DUMMY_CUSTOMER_ID = '11111111-1111-1111-1111-111111111111';

export function router(appService: AccountAppService): Router {
	const r = Router();

	// Parse URL-encoded bodies (as sent by HTML forms)
	r.use(express.urlencoded({ extended: true }));

	// Parse JSON bodies (as sent by API clients)
	r.use(express.json());

	// a test endpoint
	r.get('/ping', nocache(), (_req, res) => res.type('text/plain').send('Pong!'));

	// endpoint that gives an overview for the account of the logged-in user
	r.get('/myaccount', nocache(), async (req, res) => {
		const serializeError = await import('serialize-error').then(
			({ serializeError }) => serializeError,
		);

		try {
			const accountOverview = await appService.accountOverviewForCustomer(DUMMY_CUSTOMER_ID);
			res.json(accountOverview);
		} catch (error: unknown) {
			logger.error('internal error while getting an account overview', serializeError(error));
			res.status(500).send('internal error');
		}
	});

	return r;
}
