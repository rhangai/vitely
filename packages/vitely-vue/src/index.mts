import { default as vitePluginVue } from '@vitejs/plugin-vue';
import { PluginOption } from 'vite';
import { VitelyVueConfig, VitelyVueConfigResolved } from './config.mjs';
import vitelyPluginVueCore from './core.mjs';
import { devServerPlugin } from './dev-server.mjs';
import routerPlugin from './router/index.mjs';

function resolveConfig(
	config: VitelyVueConfig | undefined
): VitelyVueConfigResolved {
	return {
		ssr: true,
		standaloneServer: false,
		...config,
	};
}

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
	];
}
