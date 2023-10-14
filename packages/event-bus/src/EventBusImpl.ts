import type { EventBus } from './EventBus';
import amqp from 'amqplib';

export async function connectToEventBus(): Promise<EventBus> {
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
					console.log('Received:', received);

					await callback(JSON.parse(received));
					ch1.ack(msg);
				}
			});
		},
	};
}
