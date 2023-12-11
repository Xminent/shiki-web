<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import MarkdownIt from 'markdown-it';
	import toast from 'svelte-french-toast';
	import SvelteMarkdown from 'svelte-markdown';

	let userInput = '';
	let answers: { type: 'text' | 'markdown'; content: string; self: boolean; timeTaken?: string }[] =
		[];
	let isLoading = false;
	let ms = 0;

	type Character = {
		idx: number;
		name: string;
		image: string | null;
	};

	let characters: Character[] = [
		{ idx: 0, name: 'Bing', image: null },
		{ idx: 1, name: 'Nami', image: null },
		{ idx: 2, name: 'Discord Mod', image: null },
		{ idx: 3, name: 'Makima', image: null }
	];

	let character: Character = characters[0];

	async function sendInput() {
		if (!userInput.trim()) {
			return;
		}

		const query = userInput;
		userInput = '';
		isLoading = true;
		const now = new Date();

		const interval = setInterval(() => {
			ms += 50;
		}, 50);

		try {
			answers = [...answers, { type: 'text', content: query, self: true }];

			const res = await fetch('/api/ai', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ character: character.name, query })
			});

			const { text: content, image } = await res.json();
			console.log({ content });

			if (!content) {
				throw new Error('No content');
			}

			if (image) {
				const oldCharacter = character;
				oldCharacter.image = image;

				const oldCharacters = characters;
				oldCharacters[character.idx] = oldCharacter;

				characters = oldCharacters;
			}

			console.log({ content });

			const md = new MarkdownIt();
			const mdRender = md.render(content);
			const after = new Date();
			const timeTaken = after.getTime() - now.getTime();
			const timeTakenStrNormalized =
				timeTaken > 1000 ? (timeTaken / 1000).toFixed(2) + 's' : timeTaken + 'ms';

			if (mdRender) {
				answers = [
					...answers,
					{ type: 'markdown', content, self: false, timeTaken: timeTakenStrNormalized }
				];
			} else {
				answers = [
					...answers,
					{ type: 'text', content, self: false, timeTaken: timeTakenStrNormalized }
				];
			}
		} catch (error) {
			toast.error('Something went wrong. Please try again.');
		} finally {
			isLoading = false;
			clearInterval(interval);
			ms = 0;
		}
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		sendInput();
	}

	function handleChangeCharacter(opt: any) {
		if (opt) {
			character = characters[(opt.value as Character).idx];
		}
	}
</script>

<svelte:head>
	<title>Discord Admin AI Chat</title>
</svelte:head>

<div class="flex p-4 gap-4 flex-col">
	<div class="flex flex-col">
		<h1 class="text-3xl font-bold mb-4">Discord Admin AI Chat</h1>
		<p class="text-gray-400">
			Powered by: <a href="https://api.freegpt4.ddns.net" class="text-blue-500 hover:text-blue-700"
				>https://api.freegpt4.ddns.net</a
			>
		</p>
	</div>
	<div class="flex flex-col items-center gap-2">
		{#each answers as answer}
			<div class="flex flex-row gap-2 items-center">
				{#if character.image && !answer.self}
					<img
						src={character.image}
						alt={character.name}
						width={50}
						height={50}
						class="rounded-full object-contain"
					/>
				{/if}
				{#if answer.type === 'markdown'}
					<div
						class={cn(
							'flex flex-col gap-1 bg-gray-800 p-4 mb-2 rounded',
							answer.self ? 'bg-blue-500 hover:bg-blue-700 text-right' : 'text-left'
						)}
					>
						<SvelteMarkdown source={answer.content} />
						{#if answer.timeTaken}
							<p class="text-gray-400">Time taken: {answer.timeTaken}</p>
						{/if}
					</div>
				{:else}
					<div
						class={cn(
							'flex flex-col gap-1 bg-gray-800 p-4 mb-2 rounded',
							answer.self ? 'bg-blue-500 hover:bg-blue-700 text-right' : 'text-left'
						)}
					>
						<p>{answer.content}</p>
						{#if answer.timeTaken}
							<p class="text-gray-400">Time taken: {answer.timeTaken}</p>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
	<form on:submit={handleSubmit} class="flex flex-col items-start gap-2">
		<div class="relative">
			<Select.Root
				selected={{
					value: character,
					label: character.name
				}}
				onSelectedChange={handleChangeCharacter}
			>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Choose a character" />
				</Select.Trigger>
				<Select.Content>
					{#each characters as character}
						<Select.Item value={character}>{character.name}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<span class="absolute right-2 top-2 pointer-events-none">
				<svg
					class="w-5 h-5 text-gray-400"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</span>
		</div>
		<Input
			type="text"
			class="p-2 rounded"
			bind:value={userInput}
			autocomplete="off"
			placeholder="Ask something e.g. What is the meaning of life?"
		/>
		<Button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
			>Send</Button
		>
	</form>

	{#if ms > 0}
		<div class="flex justify-center">
			<p class={isLoading ? 'loading' : ''}>
				{ms > 1000 ? (ms / 1000).toFixed(1) : ms}
				{ms > 1000 ? 's' : 'ms'}
			</p>
		</div>
	{/if}
</div>

<style>
	.loading {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
