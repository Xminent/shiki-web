<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { cn } from '$lib/utils';

	export let name: string;
	export let clicked: boolean;
	export let onClick: () => void;
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<button class="h-8 px-2 w-full" on:click={onClick}>
			<div
				class={cn(
					'flex justify-start items-center rounded-sm hover:bg-gray-200 dark:hover:bg-zinc-700',
					clicked && 'bg-gray-200 dark:bg-zinc-700'
				)}
			>
				<div class="flex rounded-sm gap-2 p-1 max-w-full">
					<div class="flex justify-center items-center">
						<slot />
					</div>
					<div class="flex justify-start items-center text-sm font-medium">
						{name}
					</div>
				</div>
			</div>
		</button>
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item>
			<p class="text-gray-500 dark:text-zinc-400">Mark as Read</p>
		</ContextMenu.Item>
		<ContextMenu.Item>
			<p class="text-indigo-400">Invite People</p>
		</ContextMenu.Item>
		<ContextMenu.Item>Copy Link</ContextMenu.Item>
		<ContextMenu.Item>Edit Channel</ContextMenu.Item>
		<ContextMenu.Item>Copy Channel ID</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
