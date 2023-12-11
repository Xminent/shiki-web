<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import { Label } from './ui/label';

	export let onSubmit: (text: string) => void;
	export let placeholder: string;

	let files: FileList;
	let inputText = '';
	let textareaRows = 1;

	$: if (files) {
		console.log(files);

		for (const file of files) {
			console.log(`${file.name}: ${file.size} bytes`);
		}
	}

	$: {
		textareaRows = Math.min(inputText.split('\n').length, 10);
	}
</script>

<div class="flex flex-row">
	<div
		class="flex flex-row justify-center items-center w-[48px] bg-gray-200 dark:bg-zinc-900 rounded-tl-md rounded-bl-md"
	>
		<Label for="files">
			<div
				class="flex justify-center-items-center rounded-full bg-gray-100 dark:bg-zinc-500 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-400"
			>
				<Plus color="black" class="w-5 h-5" />
			</div>
		</Label>
		<input bind:files multiple id="files" type="file" class="hidden" />
	</div>
	<textarea
		class="w-full px-4 py-2 text-sm bg-gray-200 dark:bg-zinc-900 rounded-tr-md rounded-br-md focus:outline-none text-black dark:text-white resize-none"
		rows={textareaRows}
		bind:value={inputText}
		{placeholder}
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
			onSubmit(text);
			inputText = '';
		}}
	/>
</div>
