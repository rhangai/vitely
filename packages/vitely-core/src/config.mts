import type { VitelyPlugin } from './plugin.mjs';

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
