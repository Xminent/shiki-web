<script lang="ts">
	import type { Message } from '../../types/sidebar';

	export let message: Message;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="flex flex-row gap-2 items-center p-1 hover:bg-gray-100 dark:hover:bg-zinc-900">
	{#if message.author.avatar}
		<img
			class="w-10 h-10 rounded-full object-cover"
			src={message.author.avatar}
			alt={message.author.username}
		/>
	{/if}
	<div class="flex-flex-col">
		<div class="flex flex-row gap-2">
			<p class="font-bold">
				{message.author.username}
			</p>
			<p class="text-gray-400">
				{new Date(message.createdAt).toLocaleString()}
			</p>
		</div>
		<p>
			{message.content}
		</p>
	</div>
</div>
