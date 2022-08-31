/// <reference path="../types/virtual.d.ts" />
import { default as vitePluginVue } from '@vitejs/plugin-vue';
import { corePlugin } from '@vitely/core';
import { PluginOption } from 'vite';
import { resolveConfig, VitelyVueConfig } from './config.mjs';
import headPlugin from './plugins/head.mjs';
import routerPlugin from './plugins/router.mjs';
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
				'virtual:vitely/vue/app.vue': '/app.vue',
			},
		}),
		routerPlugin(config),
		storePlugin(config),
		headPlugin(config),
	];
}
