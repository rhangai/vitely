import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { default as vitePluginReact } from '@vitejs/plugin-react';
import {
	corePlugin,
	devServerPlugin,
	pluginsPlugin,
	middlewaresPlugin,
} from '@vitely/core/plugins';
import { PluginOption } from 'vite';
import { resolveConfig, VitelyVueConfig } from './config.mjs';
import './types.mjs';

/**
 * Main entrypoint
 * @param config
 * @returns A vite plugin object (Or plugins :O)
 */
export default function vitelyPluginVue(
	config?: VitelyVueConfig
): PluginOption {
	const vitelyVueConfig = resolveConfig(config);
	return [
		// Plugins
		vitePluginReact(),
		devServerPlugin({
			ssr: vitelyVueConfig.ssr,
		}),
		corePlugin({
			moduleBase: dirname(fileURLToPath(import.meta.url)),
			ssr: vitelyVueConfig.ssr,
			standaloneServer: vitelyVueConfig.standaloneServer,
			alias: {
				'virtual:vitely/vue/app.vue': '/app.vue',
			},
		}),
		pluginsPlugin(vitelyVueConfig.plugins),
		middlewaresPlugin(vitelyVueConfig.middlewares),
	];
}
