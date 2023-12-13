export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: 'Shiki',
	description: 'Imagine a place where you can share your thoughts and experiences with others.',
	mainNav: [
		{
			title: 'Chat',
			href: '/chat'
		}
	],
	links: {
		twitter: 'https://twitter.com/xminent',
		github: 'https://github.com/xminent/shiki-web',
		docs: 'https://docs.shiki.space'
	}
};
