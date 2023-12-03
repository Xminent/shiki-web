import * as z from 'zod';

export const userAuthSignupSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
	username: z
		.string()
		.trim()
		.min(3, { message: 'Username must be at least 3 characters' })
		.regex(/^[a-zA-Z0-9_]*$/, {
			message: 'Username can only contain letters, numbers, and underscores'
		}),
	password: z.string().regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'), {
		message:
			'Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number'
	})
});

export const userAuthLoginSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
	password: z.string().regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'), {
		message:
			'Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number'
	})
});
