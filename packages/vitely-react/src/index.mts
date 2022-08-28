import { default as vitePluginReact } from '@vitejs/plugin-react';
import { corePlugin } from '@vitely/core/plugins';
import { PluginOption } from 'vite';
import { resolveConfig, VitelyReactConfig } from './config.mjs';
import './types.mjs';
import routerPlugin from './router/index.mjs';

/**
 * Main entrypoint
 * @param configParam
 * @returns A vite plugin object (Or plugins :O)
 */
export default function vitelyPluginVue(
	configParam?: VitelyReactConfig
): PluginOption {
	const config = resolveConfig(configParam);
	return [
		vitePluginReact(),
		corePlugin(config),
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
