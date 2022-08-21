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

/**
 * Resolve the config
 */
export function resolveConfig(
	configParam: VitelyCoreConfig
): VitelyCoreConfigResolved {
	const { root } = configParam;
	return {
		root,
		ssr: configParam.ssr !== false,
		plugins: configParam.plugins ?? [],
		devServer: {
			port: 3000,
			...configParam.devServer,
		},
	};
}
