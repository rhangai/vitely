import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { default as vitePluginVue } from '@vitejs/plugin-vue2';
import {
	corePlugin,
	devServerPlugin,
	pluginsPlugin,
	middlewaresPlugin,
} from '@vitely/core/plugins';
import { PluginOption } from 'vite';
import { resolveConfig, VitelyVueConfig } from './config.mjs';
import headPlugin from './head/index.mjs';
import routerPlugin from './router/index.mjs';
import storePlugin from './store/index.mjs';
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
		vitePluginVue(),
		devServerPlugin({
			ssr: vitelyVueConfig.ssr,
		}),
		corePlugin({
			moduleBase: dirname(fileURLToPath(import.meta.url)),
			ssr: vitelyVueConfig.ssr,
			standaloneServer: vitelyVueConfig.standaloneServer,
			alias: {
				'virtual:vitely/vue2/app.vue': '/app.vue',
			},
		}),
		pluginsPlugin(vitelyVueConfig.plugins),
		middlewaresPlugin(vitelyVueConfig.middlewares),
		routerPlugin(vitelyVueConfig),
		storePlugin(vitelyVueConfig),
		headPlugin(vitelyVueConfig),
	];
}
