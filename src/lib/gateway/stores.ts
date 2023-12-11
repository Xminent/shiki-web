import { writable } from 'svelte/store';
import type { Channel, Message } from '../../types/sidebar';

export const channelStore = writable<Record<string, Channel>>({});

export const messageStore = writable<Record<string, Message[]>>({});
