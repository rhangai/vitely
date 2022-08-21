import type { VitelyPlugin } from './plugin.js';

export type VitelyCoreDevServerConfig = {
	port?: number;
};

export type VitelyCoreConfig = {
	root: string;
	plugins?: VitelyPlugin[];
	devServer?: VitelyCoreDevServerConfig;
};
