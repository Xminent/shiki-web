<script>
	import CatGif from '$lib/assets/images/cat.gif';
</script>

<div class="container grid items-center gap-6 pb-8 pt-6 md:py-10">
	<div class="flex flex-col-reverse items-center gap-8 lg:flex-row lg:justify-center">
		<div
			class="flex max-w-[500px] flex-col items-center justify-center space-y-4 text-center md:items-start md:text-left"
		>
			<h1 class="text-3xl font-extrabold uppercase leading-tight md:text-4xl">Wrong Turn?</h1>
			<p class="max-w-[700px] text-lg text-muted-foreground">
				You look lost, stranger. You know what helps when you’re lost? A piping hot bowl of noodles.
				Take a seat, we’re frantically at work here cooking up something good. Oh, you need
				something to read? These might help you:
			</p>
			<ul class="space-y-2">
				<li>Check your internet connection</li>
				<li>Try a different search term</li>
				<li>Try again in a few seconds</li>
			</ul>
		</div>
		<img
			src={CatGif}
			alt="hero"
			width={500}
			height={500}
			class="max-h-[400px] rounded-2xl object-cover"
		/>
	</div>
</div>
