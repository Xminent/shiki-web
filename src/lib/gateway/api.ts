import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { channelStore, messageStore } from '$lib/gateway/stores';
import { parseWithBigInt } from '$lib/utils';
import { deserializeMessage, type Channel } from '../../types/sidebar';

export const fetchChannels = async (token: string) => {
	try {
		const res = await fetch(`${PUBLIC_BACKEND_URL}/api/channels`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		const channels = parseWithBigInt(await res.text()) as Channel[];

		channelStore.update((store) => {
			channels.forEach((channel: Channel) => {
				store[channel.id.toString()] = {
					id: channel.id,
					name: channel.name
				};
			});

			return store;
		});
	} catch (error) {
		console.error(`Could not fetch channels: ${error}`);
		return [];
	}
};

export const fetchMessages = async (channelId: bigint, token: string) => {
	try {
		const res = await fetch(`${PUBLIC_BACKEND_URL}/api/channels/${channelId}/messages`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		const data = parseWithBigInt(await res.text());
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const messages = data.map((item: any) => {
			return deserializeMessage(item);
		});

		messageStore.update((store) => {
			store[channelId.toString()] = messages ?? [];
			return store;
		});

		console.log(`Fetched ${messages.length} messages for channel ${channelId}`);
	} catch (error) {
		console.error(`Could not fetch messages: ${error}`);
	}
};

export const sendMessage = async (channelId: bigint, content: string, token: string) => {
	try {
		await fetch(`${PUBLIC_BACKEND_URL}/api/channels/${channelId}/messages`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content })
		});
	} catch (error) {
		console.error(`Could not send message: ${error}`);
	}
};