/// <reference path="./types/index.mts" />
import { default as vitePluginVue } from '@vitejs/plugin-vue2';
import { corePlugin } from '@vitely/core';
import { PluginOption } from 'vite';
import { resolveConfig, VitelyVueConfig } from './config.mjs';
import headPlugin from './plugins/head.mjs';
import layoutsPlugin from './plugins/layouts.mjs';
import routerPlugin from './plugins/router.mjs';
import shimPlugin from './plugins/shim.mjs';
import storePlugin from './plugins/store.mjs';

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
			env: {
				VITELY_VUE2_USE_COMPONENTS: true,
				VITELY_VUE2_SHIM_NUXT2: config.shim.nuxt2,
			},
		}),
		headPlugin(config),
		layoutsPlugin(config),
		routerPlugin(config),
		shimPlugin(config),
		storePlugin(config),
	];
}
