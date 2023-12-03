<script lang="ts">
	import { cn } from '$lib/utils';
	import { siteConfig } from '../../config/site';
	import type { NavItem } from '../../types/nav';
	import { Icons } from './icons';

	export let items: NavItem[];
</script>

<div
	class={cn(
		'fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden'
	)}
>
	<div class="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
		<a href="/" class="flex items-center space-x-2">
			<Icons.logo />
			<span class="font-bold">{siteConfig.name}</span>
		</a>
		<nav class="grid grid-flow-row auto-rows-max text-sm">
			{#each items as item}
				<a
					href={item.disabled ? '#' : item.href}
					class={cn('flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline', {
						'cursor-not-allowed opacity-60': item.disabled
					})}
				>
					{item.title}
				</a>
			{/each}
		</nav>
		<slot />
	</div>
</div>
