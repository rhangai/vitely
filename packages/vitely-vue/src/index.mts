import { default as vitePluginVue } from '@vitejs/plugin-vue';
import { PluginOption } from 'vite';
import { devServerPlugin } from './dev-server.mjs';
import routerPlugin from './router/index.mjs';

export default function vitelyPluginVue(): PluginOption {
	return [
		// Plugins
		vitePluginVue(),
		devServerPlugin(),
		routerPlugin(),
	];
}
