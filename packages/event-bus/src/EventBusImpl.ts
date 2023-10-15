import amqp from 'amqplib';
import { logger } from 'express-wolox-logger';
import type { EventBus } from './EventBus';

export async function connectToEventBus(): Promise<EventBus> {
	const serializeError = await import('serialize-error').then(
		({ serializeError }) => serializeError,
	);

	const conn = await amqp.connect('amqp://guest:guest@localhost:5672/');

	return {
		async sendEvent(eventTypeName, payload) {
			const ch2 = await conn.createChannel();
			await ch2.assertQueue(eventTypeName);

			ch2.sendToQueue(eventTypeName, Buffer.from(JSON.stringify(payload)));

			await ch2.close();
		},

		async consumeEvents(eventTypeName, callback) {
			const ch1 = await conn.createChannel();
			await ch1.assertQueue(eventTypeName);

			await ch1.consume(eventTypeName, async (msg) => {
				if (msg === null) {
					console.log('Consumer cancelled by server');
				} else {
					const received = msg.content.toString();
					console.log('Received:', eventTypeName, received);

					try {
						await callback(JSON.parse(received));
					} catch (e) {
						logger.error(
							'Error while processing a',
							eventTypeName,
							'event:',
							serializeError(e),
						);
					} finally {
						// This is possibly incorrect: It acknowledges
						// an event even if an error happened.
						// We do this out of laziness.
						// TODO: think about handling dead letter queues.
						ch1.ack(msg);
					}
				}
			});
		},
	};
}
