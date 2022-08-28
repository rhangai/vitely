/// <reference path="./virtual-types.mts" />
import { default as vitePluginVue } from '@vitejs/plugin-vue2';
import { corePlugin } from '@vitely/core/plugins';
import { PluginOption } from 'vite';
import { resolveConfig, VitelyVueConfig } from './config.mjs';
import headPlugin from './head/index.mjs';
import routerPlugin from './router/index.mjs';
import storePlugin from './store/index.mjs';

// Types
export * from './types.mjs';

/**
 * Main entrypoint
 * @param config
 * @returns A vite plugin object (Or plugins :O)
 */
export default function vitelyPluginVue(
	configParam?: VitelyVueConfig
): PluginOption {
	const config = resolveConfig(configParam);
	return [
		// Plugins
		vitePluginVue(),
		corePlugin({
			config,
			alias: {
				'virtual:vitely/vue2/app.vue': '/app.vue',
			},
		}),
		routerPlugin(config),
		storePlugin(config),
		headPlugin(config),
	];
}
