import { writable } from 'svelte/store';
import type { Message } from '../types/sidebar';

export const messageStore = writable<Record<string, Message[]>>({});

export function updateMessages(channelId: bigint, messages: Message[]) {
	messageStore.update((store) => {
		store[channelId.toString()] = messages;
		return store;
	});
}
