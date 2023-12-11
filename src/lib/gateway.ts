import { PUBLIC_GATEWAY_URL } from '$env/static/public';
import { deserializeMessage } from '../types/sidebar';
import { messageStore } from './messages';
import { parseWithBigInt } from './utils';

export class GatewayClient {
	private token: string;
	private ws: WebSocket;

	constructor(token: string) {
		this.token = token;
		this.ws = new WebSocket(PUBLIC_GATEWAY_URL);

		this.ws.onopen = () => {
			const identify = JSON.stringify({
				op: 0,
				d: {
					token: this.token
				}
			});

			this.ws.send(identify);
			console.log('Connected and sent identify', identify);
		};
		this.ws.onmessage = this.onMessage.bind(this);
	}

	private onMessage(event: MessageEvent) {
		try {
			const data = parseWithBigInt(event.data);
			console.log('Received gateway message', data);
			const { op, d } = data;

			if (op === 2) {
				const message = deserializeMessage(d);

				if (!message) {
					return;
				}

				const channelId = message.channelId.toString();

				messageStore.update((store) => {
					store[channelId] = [...(store[channelId] || []), message];
					return store;
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	close() {
		this.ws.close();
	}
}
