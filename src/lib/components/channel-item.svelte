<script lang="ts">
	import { cn } from '$lib/utils';

	export let name: string;
	export let clicked: boolean;
	export let onClick: () => void;
</script>

<button class="h-8 px-2" on:click={onClick}>
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
