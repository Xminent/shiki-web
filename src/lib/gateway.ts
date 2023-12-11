import { PUBLIC_GATEWAY_URL } from '$env/static/public';
import { deserializeChannel, deserializeMessage } from '../types/sidebar';
import { channelStore, messageStore } from './gateway/stores';
import { parseWithBigInt } from './utils';

enum GatewayEvent {
	Identify = 0,
	MessageCreate = 2,
	ChannelCreate = 3
}

export class GatewayClient {
	private token: string;
	private ws: WebSocket;

	constructor(token: string) {
		this.token = token;
		this.ws = new WebSocket(PUBLIC_GATEWAY_URL);

		this.ws.onopen = () => {
			const identify = JSON.stringify({
				op: GatewayEvent.Identify,
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

			switch (op) {
				case GatewayEvent.MessageCreate:
					return this.handleMessageCreate(d);
				case GatewayEvent.ChannelCreate:
					return this.handleChannelCreate(d);
			}
		} catch (error) {
			console.error(error);
		}
	}

	close() {
		this.ws.close();
	}

	private async handleMessageCreate(data: unknown) {
		const message = deserializeMessage(data);

		if (!message) {
			return;
		}

		const channelId = message.channelId.toString();

		messageStore.update((store) => {
			store[channelId] = [...(store[channelId] || []), message];
			return store;
		});
	}

	private async handleChannelCreate(data: unknown) {
		const channel = deserializeChannel(data);

		if (!channel) {
			return;
		}

		channelStore.update((store) => {
			store[channel.id.toString()] = channel;
			return store;
		});
	}
}
