<script lang="ts">
	import { goto } from '$app/navigation';
	import { ThemeToggle } from '$lib';
	import { token } from '$lib/auth';
	import { siteConfig } from '../../config/site';
	import { Icons } from './icons';
	import MainNav from './main-nav.svelte';
	import { buttonVariants } from './ui/button';
</script>

<header class="sticky top-0 z-40 w-full border-b bg-background">
	<div class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
		<MainNav items={siteConfig.mainNav} />
		<div class="flex flex-1 items-center justify-end space-x-4">
			<nav class="flex items-center space-x-1">
				{#if !$token}
					<a href="/login" class={buttonVariants()}>Login</a>
				{:else}
					<button
						class={buttonVariants()}
						on:click={() => {
							goto('/channels');
						}}>Open Shiki</button
					>
				{/if}
				<a href={siteConfig.links.github} target="_blank" rel="noreferrer">
					<div
						class={buttonVariants({
							size: 'icon',
							variant: 'ghost'
						})}
					>
						<Icons.github class="h-5 w-5" />
						<span class="sr-only">GitHub</span>
					</div>
				</a>
				<a href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
					<div
						class={buttonVariants({
							size: 'icon',
							variant: 'ghost'
						})}
					>
						<Icons.twitter class="h-5 w-5 fill-current" />
						<span class="sr-only">Twitter</span>
					</div>
				</a>
				<ThemeToggle />
			</nav>
		</div>
	</div>
</header>
