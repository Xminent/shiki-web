<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SidebarItem } from '../../types/sidebar';
	import ChannelItem from './channel-item.svelte';

	export let items: SidebarItem[];
	export let onItemClick: (item: SidebarItem) => void;

	let hovered = false;
	let selectedItem: SidebarItem | null = null;
</script>

<div class="w-[240px] flex flex-col bgoverflow-hidden bg-gray-300 dark:bg-zinc-800">
	<div
		class="flex items-center h-[48px] px-[10px]"
		style="box-shadow: 0 1px 0 hsl( 0 calc( 1 * 0%) 0.8% / 0.2), 0 1.5px 0 hsl( 240 calc( 1 * 7.7%) 2.5% / 0.05), 0 2px 0 hsl( 0 calc( 1 * 0%) 0.8% / 0.05);"
	>
		<button
			type="button"
			class="bg-zinc-900 dark:bg-zinc-900 rounded-sm text-sm h-[28px] overflow-hidden text-ellipsis whitespace-nowrap w-full text-left px-[6px] py-[1px]"
			style="color: hsl( 214 calc( 1 * 8.1%) 61.2% / 1)">Find or start a conversation</button
		>
	</div>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class={cn('overflow-y-auto', {
			'scrollbar-hide': !hovered
		})}
		on:mouseenter={() => (hovered = true)}
	>
		<div class="flex flex-col justify-center gap-[2px]">
			<div aria-hidden="true" style="height: 8px;" />
			{#each items as item}
				<ChannelItem
					name={item.name}
					clicked={selectedItem === item}
					onClick={() => {
						onItemClick(item);
						selectedItem = item;
					}}
				>
					<svelte:component this={item.icon} />
				</ChannelItem>
			{/each}
		</div>
	</div>
</div>
