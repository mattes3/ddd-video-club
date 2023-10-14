import { logger } from 'express-wolox-logger';
import { Model } from 'objection';
import { initKnexAndObjection } from '@ddd-video-club-v2/database';

import api from './adapter/http/api';
import { RentalRepositoryImpl } from './adapter/persistence/RentalRepositoryImpl';
import { getRentalAppService } from './domainmodel/RentalAppService';

async function server() {
	try {
		await initKnexAndObjection();

		const appService = getRentalAppService(RentalRepositoryImpl, Model.transaction.bind(Model));
		const port = process.env.PORT ?? 4001;

		api(appService).listen(port);

		return `API Dev server listening on port ${port}`;
	} catch (error: unknown) {
		logger.error('Rental API devServer error', error);
	}
}

server().then(console.log).catch(console.error);
