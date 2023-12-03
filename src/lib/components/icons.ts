import {
	ChevronLeft,
	Command,
	Loader2,
	Moon,
	SunMedium,
	Twitter,
	X,
	type Icon as LucideIcon
} from 'lucide-svelte';

import { GithubLogo } from 'radix-icons-svelte';

export type Icon = LucideIcon;

export const Icons = {
	sun: SunMedium,
	moon: Moon,
	twitter: Twitter,
	logo: Command,
	close: X,
	chevronLeft: ChevronLeft,
	spinner: Loader2,
	github: GithubLogo
};
