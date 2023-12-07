<script lang="ts">
	import type { Message, SidebarItem } from '../../types/sidebar';
	import MessageItem from './message-item.svelte';

	export let item: SidebarItem;
	export let messages: Message[];
	export let compactList: boolean[];
	export let onSendMessage: (text: string) => void;

	let inputText = '';
	let messageList: HTMLElement;
	let textareaRows = 1;

	const scrollToBottom = async (node: HTMLElement) => {
		node.scroll({ top: node.scrollHeight, behavior: 'instant' });
	};

	$: {
		textareaRows = Math.min(inputText.split('\n').length, 10);
	}
</script>

<div class="flex flex-col overflow-hidden flex-grow h-[100vh]">
	<section class="flex flex-col justify-center min-h-[48px] p-2">
		<div class="flex flex-row gap-2">
			<svelte:component this={item.icon} />
			{item.name}
		</div>
	</section>
	<section class="overflow-y-auto scrollable-section" bind:this={messageList}>
		<ul class="p-2">
			{#each messages as message, i}
				<li class="text-sm text-gray-600 dark:text-zinc-300">
					<MessageItem {message} isCompact={compactList[i]} />
				</li>
			{/each}
		</ul>
	</section>
	<section class="p-4 w-full">
		<textarea
			class="w-full px-4 py-2 text-sm bg-gray-200 dark:bg-zinc-900 rounded-md focus:outline-none text-black dark:text-white resize-none"
			rows={textareaRows}
			bind:value={inputText}
			placeholder={`Message #${item.name}`}
			on:keydown={(e) => {
				const text = inputText.trim();

				if (e.key === 'Enter') {
					if (e.shiftKey) {
						return;
					}

					if (!text) {
						e.preventDefault();
						return;
					}
				}

				if (e.key !== 'Enter' || e.shiftKey || !text) {
					return;
				}

				e.preventDefault();
				onSendMessage(text);
				inputText = '';
				scrollToBottom(messageList);
			}}
		/>
	</section>
</div>

<style>
	.scrollable-section::-webkit-scrollbar {
		width: 8px;
	}

	.scrollable-section::-webkit-scrollbar-track {
		background: #060607;
		border-radius: 4px;
	}

	.scrollable-section::-webkit-scrollbar-thumb {
		background: #111214;
		border-radius: 4px;
	}

	.scrollable-section::-webkit-scrollbar-thumb:hover {
		background: #111214;
	}
</style>
