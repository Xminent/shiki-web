<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { token } from '$lib/auth';
	import MainContent from '$lib/components/main-content.svelte';
	import { sendMessage } from '$lib/gateway/api';
	import { channelStore, currentSidebarItem, messageStore } from '$lib/gateway/stores';
	import { HashIcon } from 'lucide-svelte';
	import type { Message } from '../../../../types/sidebar';

	let messages: Message[] = [];

	$: {
		const { slug } = $page.params;
		const channel = Object.values($channelStore).find((c) => c.id.toString() === slug);

		if (channel) {
			currentSidebarItem.set({
				id: channel.id,
				name: channel.name,
				icon: HashIcon
			});
			messages = $messageStore[channel.id.toString()] ?? [];
		} else {
			console.log('redirecting');
			goto('/channels');
		}
	}

	function getCompactList(messages: Message[]) {
		const ret = messages.map(() => false);

		// If we have consecutive messages sent by the same author, we compact it.
		for (let i = 1; i < messages.length; i++) {
			const msg = messages[i];
			const lastMsg = messages[i - 1];
			const delta = Math.abs(lastMsg.createdAt.getTime() - msg.createdAt.getTime());

			if (msg.author.id === lastMsg.author.id && delta < 5 * 60 * 1000) {
				ret[i] = true;
			}
		}

		return ret;
	}

	async function onSendMessage(message: string) {
		if (!$token || !$currentSidebarItem) {
			return goto('/login');
		}

		await sendMessage($currentSidebarItem.id, message, $token);
	}
</script>

{#if $currentSidebarItem}
	<MainContent
		item={$currentSidebarItem}
		{messages}
		compactList={getCompactList(messages)}
		{onSendMessage}
	/>
{/if}
