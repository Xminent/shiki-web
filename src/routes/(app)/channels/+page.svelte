<script lang="ts">
	import MainContent from '$lib/components/main-content.svelte';
	import Sidebar from '$lib/components/sidebar.svelte';
	import { messageStore, updateMessages } from '$lib/messages';
	import { cn } from '$lib/utils';
	import { HashIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { Message, SidebarItem } from '../../../types/sidebar';

	let guilds = [
		{
			name: 'Guild 1',
			iconUrl:
				'https://cdn.discordapp.com/icons/1085290351159431290/57134761dc9f989243301c488326c84c.webp?size=96',
			channels: ['Channel 1', 'Channel 2']
		},
		{
			name: 'Guild 2',
			iconUrl:
				'https://cdn.discordapp.com/icons/519570807006167051/5e947f8c8a1a4ae8e91cbf82d89d7cf3.webp?size=96',
			channels: ['Channel 3', 'Channel 4']
		},
		{
			name: 'Guild 3',
			iconUrl:
				'https://cdn.discordapp.com/icons/298146426926530561/a_501a35da94fe2db8181e8262d8d9df7d.webp?size=96',
			channels: ['Channel 5', 'Channel 6']
		},
		...new Array(50).fill(0).map((_, i) => ({
			name: `Guild ${i + 4}`,
			iconUrl: `https://cdn.discordapp.com/icons/1081747207516078232/3568069fbb9cd0d60bdcabfd785511e8.webp?size=96`,
			channels: [`Channel ${i + 7}`, `Channel ${i + 8}`]
		}))
	];
	let selectedGuild = guilds[0];
	let activeGuild: { name: string; iconUrl: string; channels: string[] } | null = null;
	let sidebarItems: SidebarItem[] = [];
	let currentItem: SidebarItem | null = null;

	const isBigNumber = (num: number) => !Number.isSafeInteger(+num);
	const enquoteBigNumber = (jsonString: string, bigNumChecker: Function) =>
		jsonString.replaceAll(/([:\s\[,]*)(\d+)([\s,\]]*)/g, (matchingSubstr, prefix, bigNum, suffix) =>
			bigNumChecker(bigNum) ? `${prefix}"${bigNum}"${suffix}` : matchingSubstr
		);
	const parseWithBigInt = (jsonString: string, bigNumChecker: Function) =>
		JSON.parse(enquoteBigNumber(jsonString, bigNumChecker), (_, value) =>
			!isNaN(value) && bigNumChecker(value) ? BigInt(value) : value
		);

	onMount(async () => {
		const res = await fetch('http://localhost:8080/api/channels', {
			method: 'GET',
			headers: {
				Authorization: 'Bearer e2c06ec7-640d-4684-88c3-e036ea9a5e98'
			}
		});

		const data = parseWithBigInt(await res.text(), isBigNumber);

		sidebarItems = data.map((item: any) => {
			return {
				id: item.id,
				name: item.name,
				icon: HashIcon,
				messages: []
			};
		});
	});

	async function onItemClick(item: SidebarItem) {
		currentItem = item;

		const res = await fetch(`http://localhost:8080/api/channels/${item.id}/messages`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer e2c06ec7-640d-4684-88c3-e036ea9a5e98'
			}
		});

		const data = parseWithBigInt(await res.text(), isBigNumber);

		updateMessages(item.id, data ?? []);
	}

	let messages: Message[] = [];

	$: {
		if (currentItem) {
			messages = $messageStore[currentItem.id.toString()] ?? [];
		} else {
			messages = [];
		}
	}
</script>

<div class="flex min-h-screen flex-row">
	<nav class="w-[72px] bg-zinc-900 overflow-y-auto">
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
							class="w-[48px] h-[48px] rounded-[50%] overflow-hidden transition-[border-radius] duration-200 hover:rounded-[25%]"
							class:selected={selectedGuild === guild}
							on:click={() => (selectedGuild = guild)}
							on:keydown={() => (selectedGuild = guild)}
							on:mouseenter={() => (activeGuild = guild)}
							on:mouseleave={() => (activeGuild = null)}
						>
							<img src={guild.iconUrl} alt={guild.name} />
						</button>
					</div>
				{/each}
			</div>
		</div>
	</nav>
	<Sidebar items={sidebarItems} {onItemClick} />
	{#if currentItem}
		<MainContent item={currentItem} {messages} />
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
