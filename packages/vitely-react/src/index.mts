/// <reference path="../types/virtual.d.ts" />
import { default as vitePluginReact } from '@vitejs/plugin-react';
import { corePlugin } from '@vitely/core';
import { PluginOption } from 'vite';
import { resolveConfig, VitelyReactConfig } from './config.mjs';
import routerPlugin from './plugins/router.mjs';

/**
 * Main entrypoint
 * @param configParam
 * @returns A vite plugin object (Or plugins :O)
 */
export default function vitelyPluginReact(
	configParam?: VitelyReactConfig
): PluginOption {
	const config = resolveConfig(configParam);
	return [
		vitePluginReact(),
		corePlugin({
			config,
			alias: {
				'virtual:vitely/react/app.tsx': '/app.tsx',
			},
		}),
		routerPlugin(config),
		{
			name: 'vitely:react-externals',
			config() {
				return {
					ssr: {
						noExternal: ['react-helmet'],
					},
				};
			},
		},
	];
}
