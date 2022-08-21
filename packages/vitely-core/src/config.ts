import type { VitelyPlugin } from './plugin.js';

export type VitelyCoreDevServerConfig = {
	port?: number;
};

export type VitelyCoreConfig = {
	root: string;
	ssr?: boolean;
	plugins?: VitelyPlugin[];
	devServer?: VitelyCoreDevServerConfig;
};

export type VitelyCoreDevServerConfigResolved = {
	port: number;
};

export type VitelyCoreConfigResolved = {
	root: string;
	ssr: boolean;
	plugins: VitelyPlugin[];
	devServer: VitelyCoreDevServerConfigResolved;
};
