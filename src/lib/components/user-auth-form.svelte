<script lang="ts">
	import { login } from '$lib/auth';
	import { cn } from '$lib/utils';
	import { userAuthLoginSchema, userAuthSignupSchema } from '$lib/validations/auth';
	import toast from 'svelte-french-toast';
	import { Icons } from './icons';
	import { buttonVariants } from './ui/button';
	import { Input } from './ui/input';
	import { Label } from './ui/label';

	export let signUp: boolean;

	let errors: {
		email?: string[] | undefined;
		username?: string[] | undefined;
		password?: string[] | undefined;
	} = {};

	let isLoading = false;

	async function onSubmit(
		data: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		const form = data.currentTarget;
		const email = form.email.value;
		const username = form.username?.value;
		const password = form.password.value;
		const payload = { email, username, password };
		const safeParse = signUp
			? userAuthSignupSchema.safeParse(payload)
			: userAuthLoginSchema.safeParse(payload);

		if (!safeParse.success) {
			errors = safeParse.error.flatten().fieldErrors;
			return;
		}

		isLoading = true;

		try {
			const res = await fetch(`http://localhost:8080/auth/${signUp ? 'register' : 'login'}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!res?.ok) {
				return toast.error('Something went wrong. Please try again.');
			}

			const { token } = await res.json();

			login(token);

			return toast.success(signUp ? 'Account created successfully' : 'Logged in successfully');
		} catch (error) {
			console.log(error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class={cn('grid gap-6')}>
	<form on:submit={onSubmit}>
		<div class="grid gap-2">
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input
					id="email"
					type="email"
					autocapitalize="none"
					autocomplete="email"
					autocorrect="off"
					disabled={isLoading}
				/>
				{#if errors?.email}
					<p class="px-1 text-xs text-red-600">
						{errors.email}
					</p>
				{/if}
				{#if signUp}
					<Label for="username">Display Name</Label>
					<Input
						id="username"
						type="text"
						autocapitalize="none"
						autocorrect="off"
						disabled={isLoading}
					/>
					{#if errors?.username}
						<p class="px-1 text-xs text-red-600">
							{errors.username}
						</p>
					{/if}
				{/if}
				<Label for="password">Password</Label>
				<Input
					id="password"
					type="password"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
				{#if errors?.password}
					<p class="px-1 text-xs text-red-600">
						{errors.password}
					</p>
				{/if}
			</div>
			<button class={cn(buttonVariants())} disabled={isLoading}>
				{#if isLoading}
					<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Continue
			</button>
		</div>
	</form>
</div>
