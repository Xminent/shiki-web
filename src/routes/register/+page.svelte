<script>
	import BarberGif from '$lib/assets/images/barber.gif';
	import { Icons } from '$lib/components/icons';
	import { buttonVariants } from '$lib/components/ui/button';
	import UserAuthForm from '$lib/components/user-auth-form.svelte';
	import { cn } from '$lib/utils';
</script>

<svelte:head>
	<title>Create an account</title>
	<meta name="description" content="Create an account to get started." />
</svelte:head>

<div
	class="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<a
		href="/login"
		class={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 md:right-8 md:top-8')}
	>
		Login
	</a>
	<img
		class="hidden h-full lg:block"
		src={BarberGif}
		alt="African-American taken away by his own haircut"
	/>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<Icons.logo class="mx-auto h-6 w-6" />
				<h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
				<p class="text-sm text-muted-foreground">Enter your email below to create your account</p>
			</div>
			<UserAuthForm signUp={true} />
			<p class="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our{' '}
				<a href="/terms" class="hover:text-brand underline underline-offset-4">
					Terms of Service
				</a>{' '}
				and{' '}
				<a href="/privacy" class="hover:text-brand underline underline-offset-4">
					Privacy Policy
				</a>
				.
			</p>
			<p class="px-8 text-center text-sm text-foreground">
				<a href="/login" class="hover:text-brand underline underline-offset-4">
					Already have an account?
				</a>
			</p>
		</div>
	</div>
</div>
