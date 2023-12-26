<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { cn } from '$lib/utils';

	export let id: bigint;
	export let name: string;
	export let clicked: boolean;
	export let onClick: () => void;
</script>

<div class="h-8 px-2">
	<ContextMenu.Root>
		<ContextMenu.Trigger>
			<button
				class={cn(
					'w-full flex justify-start items-center rounded-sm hover:bg-gray-200 dark:hover:bg-zinc-700',
					clicked && 'bg-gray-100 dark:bg-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-600'
				)}
				on:click={onClick}
			>
				<div class="flex rounded-sm gap-2 p-1 max-w-full">
					<div class="flex justify-center items-center">
						<slot />
					</div>
					<div class="flex justify-start items-center text-sm font-medium">
						{name}
					</div>
				</div>
			</button>
		</ContextMenu.Trigger>
		<ContextMenu.Content>
			<ContextMenu.Item disabled>Mark as Read</ContextMenu.Item>
			<ContextMenu.Separator />
			<ContextMenu.Item>
				<p class="text-indigo-400">Invite People</p>
			</ContextMenu.Item>
			<ContextMenu.Item>
				<button
					on:click={() => navigator.clipboard.writeText(`${window.location.origin}/channels/${id}`)}
				>
					Copy Link
				</button>
			</ContextMenu.Item>
			<ContextMenu.Item>Edit Channel</ContextMenu.Item>
			<ContextMenu.Item>
				<button on:click={() => navigator.clipboard.writeText(id.toString())}>
					Copy Channel ID
				</button>
			</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Root>
</div>
