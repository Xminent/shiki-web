<script lang="ts">
	export let href: string;

	// TODO: Maybe process the links visited or prevent unsafe links. Mostly for just customization too.
</script>

<a class="cursor-pointer text-blue-500 hover:underline" {href} target="_blank" rel="noreferrer">
	{href}
</a>
