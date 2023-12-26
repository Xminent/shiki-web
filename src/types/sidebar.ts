import type { HomeIcon } from 'lucide-svelte';

export type SidebarItem = {
	id: bigint;
	name: string;
	icon: typeof HomeIcon;
};

export type Guild = {
	id: bigint;
	name: string;
	icon?: string;
};

export type Channel = {
	id: bigint;
	guildId?: bigint;
	name: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deserializeChannel = (data: any): Channel => {
	const guildId = data.guild_id ? BigInt(data.guild_id) : undefined;

	return {
		id: BigInt(data.id),
		guildId,
		name: data.name
	};
};

export type Message = {
	id: bigint;
	channelId: bigint;
	content: string;
	createdAt: Date;
	author: {
		id: bigint;
		avatar?: string;
		username: string;
	};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deserializeMessage = (data: any): Message => {
	const createdAt = new Date(0);
	createdAt.setUTCSeconds(data['created_at']);

	return {
		id: BigInt(data.id),
		channelId: data['channel_id'],
		content: data.content,
		createdAt,
		author: {
			id: BigInt(data.author.id),
			avatar: data.author.avatar,
			username: data.author.username
		}
	};
};
