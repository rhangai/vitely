/// <reference path="../types.d.ts" />

import { default as vitePluginVue } from '@vitejs/plugin-vue';
import { PluginOption } from 'vite';
import { resolveConfig, VitelyVueConfig } from './config.mjs';
import vitelyPluginVueCore from './core.mjs';
import { devServerPlugin } from './dev-server.mjs';
import { pluginsPlugin } from './plugins.mjs';
import routerPlugin from './router/index.mjs';

export default function vitelyPluginVue(
	config?: VitelyVueConfig
): PluginOption {
	const vitelyVueConfig = resolveConfig(config);
	return [
		// Plugins
		vitePluginVue(),
		devServerPlugin(),
		routerPlugin(),
		vitelyPluginVueCore(vitelyVueConfig),
		pluginsPlugin(vitelyVueConfig),
	];
}
