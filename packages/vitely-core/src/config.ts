import type { VitelyPlugin } from './plugin.js';

export type VitelyCoreConfig = {
	ssr?: boolean;
	plugins?: VitelyPlugin[];
};

export type VitelyCoreConfigResolved = {
	ssr: boolean;
	plugins: VitelyPlugin[];
};
