import { default as vitePluginVue } from '@vitejs/plugin-vue';
import { PluginOption } from 'vite';
import { resolveConfig, VitelyVueConfig } from './config.mjs';
import vitelyPluginVueCore from './core.mjs';
import { devServerPlugin } from './dev-server.mjs';
import { middlewaresPlugin } from './middleware.mjs';
import { pluginsPlugin } from './plugins.mjs';
import routerPlugin from './router/index.mjs';
import storePlugin from './store/index.mjs';
import './types.mjs';

export type { VitelyVuePlugin, VitelyVuePluginContext } from './plugins.mjs';

export type {
	VitelyVueMiddleware,
	VitelyVueMiddlewareContext,
} from './middleware.mjs';

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
		devServerPlugin(vitelyVueConfig),
		routerPlugin(vitelyVueConfig),
		storePlugin(vitelyVueConfig),
		vitelyPluginVueCore(vitelyVueConfig),
		pluginsPlugin(vitelyVueConfig),
		middlewaresPlugin(vitelyVueConfig),
	];
}
