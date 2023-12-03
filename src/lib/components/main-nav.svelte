<script lang="ts">
	import { page } from '$app/stores';
	import { Icons } from '$lib/components/icons';
	import MobileNav from '$lib/components/mobile-nav.svelte';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import { siteConfig } from '../../config/site';
	import type { NavItem } from '../../types/nav';

	export let items: NavItem[];

	let showMobileMenu = false;
	let pathname = '';

	onMount(() => {
		pathname = $page.url.pathname;

		page.subscribe(() => {
			pathname = $page.url.pathname;
		});
	});
</script>

<div class="flex gap-6 md:gap-10">
	<a href="/" class="hidden items-center space-x-2 md:flex">
		<Icons.logo />
		<span class="hidden font-bold sm:inline-block">
			{siteConfig.name}
		</span>
	</a>
	{#if items && items.length}
		<nav class="hidden gap-6 md:flex">
			{#each items as item}
				<a
					href={item.disabled ? '#' : item.href}
					class={cn(
						'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
						item.href.startsWith(pathname) ? 'text-foreground' : 'text-foreground/60',
						{ 'cursor-not-allowed opacity-80': item.disabled }
					)}
				>
					{item.title}
				</a>
			{/each}
		</nav>
	{/if}
	<button
		class="flex items-center space-x-2 md:hidden"
		on:click={() => (showMobileMenu = !showMobileMenu)}
	>
		{#if showMobileMenu}
			<Icons.close />
		{:else}
			<Icons.logo />
		{/if}
		<span class="font-bold">Menu</span>
	</button>
	{#if showMobileMenu && items}
		<MobileNav {items}>
			<slot />
		</MobileNav>
	{/if}
</div>
