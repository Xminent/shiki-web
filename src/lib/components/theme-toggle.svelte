<script lang="ts">
	import { Moon, Sun } from 'lucide-svelte';
	import { getThemeStore } from '../context';
	import { Button } from './ui/button';

	const theme = getThemeStore();

	function toggleTheme() {
		const newTheme = $theme === 'light' ? 'dark' : 'light';
		theme.setTheme(newTheme);
	}
</script>

<div class="relative inline-block">
	<Button variant="ghost" size="icon" on:click={toggleTheme}>
		<span class="dark:hidden">
			<Sun class="h-[1.5rem] w-[1.3rem]" />
		</span>
		<span class="hidden dark:block">
			<Moon class="h-5 w-5" />
		</span>
		<span class="sr-only">Toggle theme</span>
	</Button>
</div>
