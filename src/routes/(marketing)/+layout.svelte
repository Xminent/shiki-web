<script>
	import SiteFooter from '$lib/components/site-footer.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
</script>

<SiteHeader />
<main class="flex-1">
	<slot />
</main>
<SiteFooter />
