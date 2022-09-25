export const SITE = {
	title: 'Bun-Tea',
	description: 'Bun-Tea is a Bun-powered, and Bun-only(for now) Web API framework with full Typescript support and performance in mind.',
	defaultLanguage: 'en_US',
};

export const OPEN_GRAPH = {
	image: {
		src: 'https://github.com/one-aalam/bun-tea/blob/main/assets/social/banner.png?raw=true',
		alt:
			'bun-tea logo on a expanse of dark space,' +
			' with a tea-pot placed in the left background',
	},
	twitter: 'aftabbuddy',
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
	title: string;
	description: string;
	layout: string;
	image?: { src: string; alt: string };
	dir?: 'ltr' | 'rtl';
	ogLocale?: string;
	lang?: string;
};

export const KNOWN_LANGUAGES = {
	English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/one-aalam/bun-tea/tree/main/docs`;

export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
	indexName: 'XXXXXXXXXX',
	appId: 'XXXXXXXXXX',
	apiKey: 'XXXXXXXXXX',
};

export type Sidebar = Record<
	typeof KNOWN_LANGUAGE_CODES[number],
	Record<string, { text: string; link: string }[]>
>;

export const SIDEBAR: Sidebar = {
	en: {
		'API': [
			{ text: 'Introduction', link: 'en/introduction' },
			{ text: 'Routing', link: 'en/routing' },
			{ text: 'Routing: Context', link: 'en/context' },
            { text: 'Routing: Params', link: 'en/params' },
		],
		// 'Another Section': [{ text: 'Page 4', link: 'en/page-4' }],
	},
};
