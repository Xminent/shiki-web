<script>
	import { createThemeSwitcher, Theme } from '$lib';
	import '@fontsource-variable/inter';
	import { Toaster } from 'svelte-french-toast';
	import '../app.postcss';

	createThemeSwitcher();
</script>

<div class="relative flex min-h-screen flex-col">
	<slot />
</div>

<Theme />
<Toaster />

<style>
	* {
		font-family: 'Inter Variable', sans-serif;
	}
</style>
