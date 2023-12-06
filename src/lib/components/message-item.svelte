<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Message } from '../../types/sidebar';

	export let message: Message;
	export let isCompact: boolean = false;
	let isHovered = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="flex flex-row gap-2 items-center p-1 hover:bg-gray-100 dark:hover:bg-zinc-900"
	on:mouseenter={() => (isHovered = true)}
	on:mouseleave={() => (isHovered = false)}
>
	{#if message.author.avatar && !isCompact}
		<img
			class="w-10 h-10 rounded-full object-cover"
			src={message.author.avatar}
			alt={message.author.username}
		/>
	{/if}
	<div class="flex-flex-col">
		<div class="flex flex-row gap-2">
			{#if !isCompact}
				<p class="font-bold">
					{message.author.username}
				</p>
			{/if}
			{#if !isCompact}
				<p class="text-gray-400">
					{new Date(message.createdAt).toLocaleString()}
				</p>
			{/if}
		</div>
		{#if !isCompact}
			<p>
				{message.content}
			</p>
		{:else}
			<div class="flex flex-row items-center gap-2">
				<p class={cn('text-[10px] opacity-0', isHovered && 'opacity-100')}>
					{new Date(message.createdAt).toLocaleTimeString([], {
						hour: 'numeric',
						minute: '2-digit'
					})}
				</p>
				<p>
					{message.content}
				</p>
			</div>
		{/if}
	</div>
</div>
