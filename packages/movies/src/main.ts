import { logger } from "express-wolox-logger";

import app from "./app";

async function server() {
	try {
		const port = process.env.PORT ?? 4000;
		app.listen(port);

		return `API Dev server listening on port ${port}`;
	} catch (error: unknown) {
		logger.error("CustomerPingAPI_devServer error", error);
	}
}

server().then(console.log).catch(console.error);
