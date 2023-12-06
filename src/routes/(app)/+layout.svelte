<script>
	import { goto } from '$app/navigation';
	import { token } from '$lib/auth';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!$token) {
			goto('/login');
		}
	});
</script>

{#if $token}
	<main class="flex-1">
		<slot />
	</main>
{/if}
