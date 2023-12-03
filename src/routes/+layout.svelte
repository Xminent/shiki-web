<script>
	import { createThemeSwitcher, Theme } from '$lib';
	import SiteFooter from '$lib/components/site-footer.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import '@fontsource-variable/inter';
	import { Toaster } from 'svelte-french-toast';
	import { Router } from 'svelte-routing';
	import '../app.postcss';

	createThemeSwitcher();
	export let url = '';
</script>

<Router {url}>
	<div class="relative flex min-h-screen flex-col">
		<SiteHeader />
		<main class="flex-1">
			<slot />
		</main>
		<SiteFooter />
	</div></Router
>

<Theme />
<Toaster />

<style>
	* {
		font-family: 'Inter Variable', sans-serif;
	}
</style>
