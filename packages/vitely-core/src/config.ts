import type { VitelyPlugin } from './plugin.js';

export type VitelyCoreConfig = {
	ssr?: boolean;
	plugins?: VitelyPlugin[];
};

export type VitelyCoreConfigResolved = {
	root: string;
	outDir: string;
	ssr: boolean;
	plugins: VitelyPlugin[];
};
