<script lang="ts">
	import { cn } from '$lib/utils';

	export let name: string;
	export let clicked: boolean;
	export let onClick: () => void;
</script>

<button class="h-[42px] mx-2" on:click={onClick}>
	<div
		class={cn(
			'flex justify-start items-center h-full rounded-sm hover:bg-gray-200 dark:hover:bg-zinc-700',
			clicked && 'bg-gray-200 dark:bg-zinc-700'
		)}
	>
		<div class="flex rounded-sm gap-2 p-1">
			<div class="flex justify-center items-center w-[32px] h-[32px]">
				<slot />
			</div>
			<div class="flex flex-grow">
				<div class="flex justify-start items-center">{name}</div>
			</div>
		</div>
	</div>
</button>
