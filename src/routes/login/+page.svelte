<script>
	import { goto } from '$app/navigation';
	import { Icons } from '$lib/components/icons';
	import { buttonVariants } from '$lib/components/ui/button';
	import UserAuthForm from '$lib/components/user-auth-form.svelte';
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login to your account" />
</svelte:head>

<div class="container flex h-screen w-screen flex-col items-center justify-center">
	<a
		href="/"
		class="{buttonVariants({ variant: 'ghost' })} absolute left-4 top-4 md:left-8 md:top-8"
		on:click|preventDefault={() => goto('/')}
	>
		<Icons.chevronLeft class="mr-2 h-4 w-4" />
		Back
	</a>
	<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
		<div class="flex flex-col space-y-2 text-center">
			<Icons.logo class="mx-auto h-6 w-6" />
			<h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
			<p class="text-sm text-muted-foreground">Enter your email to sign in to your account</p>
		</div>
		<UserAuthForm signUp={false} />
		<p class="px-8 text-center text-sm text-muted-foreground">
			Need an account?{' '}
			<a
				href="/register"
				class="hover:text-brand text-foreground underline underline-offset-4"
				on:click|preventDefault={() => goto('/register')}
			>
				Sign Up
			</a>
		</p>
	</div>
</div>
