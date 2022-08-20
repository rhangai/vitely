import type { VitelyPlugin } from './plugin.js';

export type VitelyCoreDevServerOptions = {
	port?: number;
};

export type VitelyCoreOptions = {
	root: string;
	plugins?: VitelyPlugin[];
	devServer?: VitelyCoreDevServerOptions;
};
