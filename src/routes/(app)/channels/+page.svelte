<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { token } from '$lib/auth';
	import MainContent from '$lib/components/main-content.svelte';
	import Sidebar from '$lib/components/sidebar.svelte';
	import { GatewayClient } from '$lib/gateway';
	import { messageStore, updateMessages } from '$lib/messages';
	import { cn, parseWithBigInt } from '$lib/utils';
	import { HashIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import {
		deserializeMessage,
		type Guild,
		type Message,
		type SidebarItem
	} from '../../../types/sidebar';

	let guilds: Guild[] = [
		{
			id: BigInt(0),
			name: 'Home',
			icon: 'https://cdn.discordapp.com/embed/avatars/0.png'
		},
		{
			id: BigInt(1),
			name: 'Global'
		}
	];
	let selectedGuild: Guild | null = null;
	let activeGuild: Guild | null = null;
	let sidebarItems: SidebarItem[] = [];
	let currentItem: SidebarItem | null = null;
	let gatewayClient: GatewayClient | null = null;

	onMount(() => {
		if (!$token) {
			return goto('/login');
		}

		(async () => {
			try {
				const res = await fetch(`${PUBLIC_BACKEND_URL}/api/channels`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${$token}`
					}
				});

				const data = parseWithBigInt(await res.text());

				sidebarItems = data.map((item: any) => {
					return {
						id: item.id,
						name: item.name,
						icon: HashIcon,
						messages: []
					};
				});
			} catch (error) {
				console.error(`Could not fetch channels: ${error}`);
			}

			gatewayClient = new GatewayClient($token);
		})();

		return () => {
			gatewayClient?.close();
			gatewayClient = null;
		};
	});

	async function onItemClick(item: SidebarItem) {
		currentItem = item;

		const res = await fetch(`${PUBLIC_BACKEND_URL}/api/channels/${item.id}/messages`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${$token}`
			}
		});

		const data = parseWithBigInt(await res.text());
		const messages = data.map((item: any) => {
			return deserializeMessage(item);
		});

		updateMessages(item.id, messages ?? []);
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

	let messages: Message[] = [];

	$: {
		if (currentItem) {
			messages = $messageStore[currentItem.id.toString()] ?? [];
		} else {
			messages = [];
		}
	}

	async function onSendMessage(message: string) {
		if (!currentItem) {
			return;
		}

		await fetch(`${PUBLIC_BACKEND_URL}/api/channels/${currentItem.id}/messages`, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer e2c06ec7-640d-4684-88c3-e036ea9a5e98',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				content: message
			})
		});
	}
</script>

<div class="flex min-h-screen flex-row">
	<nav class="w-[72px] bg-zinc-900 overflow-y-auto flex-shrink-0">
		<div class="scroller overflow-auto h-[100vh] scrollbar-hide">
			<div class="servers">
				{#each guilds as guild}
					<div class="flex flex-row justify-center items-center mb-2 relative">
						<div class="w-[8px] h-[48px] absolute left-0 flex items-center justify-start">
							<div
								class={cn('pill transition-all', {
									active: guild === activeGuild,
									selected: guild === selectedGuild
								})}
							/>
						</div>
						<button
							class={cn(
								'w-[48px] h-[48px] rounded-[50%] overflow-hidden transition-[border-radius] duration-200 hover:rounded-[25%]',
								{
									'rounded-[25%]': guild === selectedGuild
								}
							)}
							class:selected={selectedGuild === guild}
							on:click={() => (selectedGuild = guild)}
							on:keydown={() => (selectedGuild = guild)}
							on:mouseenter={() => (activeGuild = guild)}
							on:mouseleave={() => (activeGuild = null)}
						>
							{#if guild.icon}
								<img src={guild.icon} alt={guild.name} />
							{:else}
								<div class="w-full h-full bg-blue-600 flex justify-center items-center">
									<span class="text-2xl">{guild.name[0]}</span>
								</div>
							{/if}
						</button>
					</div>
				{/each}
			</div>
		</div>
	</nav>
	<Sidebar items={sidebarItems} {onItemClick} />
	{#if currentItem}
		<MainContent
			item={currentItem}
			{messages}
			compactList={getCompactList(messages)}
			{onSendMessage}
		/>
	{/if}
</div>

<style>
	/* For Webkit-based browsers (Chrome, Safari and Opera) */
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* For IE, Edge and Firefox */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.pill {
		width: 4px;
		height: 0;
		background-color: white;
		border-radius: 0 4px 4px 0;
		transform-origin: left;
		transition: transform 0.2s, height 0.2s;
		transform: scaleX(0);
	}

	.pill.active {
		height: 20px;
		transform: scaleX(1);
	}

	.pill.selected {
		height: 40px;
		transform: scaleX(1);
	}
</style>
