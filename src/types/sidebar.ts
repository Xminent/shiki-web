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

export type Message = {
	id: bigint;
	content: string;
	createdAt: Date;
	author: {
		id: bigint;
		avatar?: string;
		username: string;
	};
};
