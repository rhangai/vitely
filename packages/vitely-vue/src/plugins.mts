import { createVirtualModulesPlugin } from '@vitely/core';
import type { HeadClient } from '@vueuse/head';
import type { Plugin } from 'vite';
import type { App } from 'vue';
import { VitelyVueConfigResolved, VitelyVuePluginResolved } from './config.mjs';

export type VitelyVuePlugin = (
	context: VitelyVuePluginContext
) => void | Promise<void>;

export type VitelyVuePluginContext = {
	app: App;
	router: any;
	store: any;
	head: HeadClient;
};

export type VitelyVuePluginOptions = {
	context: VitelyVuePluginContext;
};

function generatePluginModule(plugins: VitelyVuePluginResolved[]) {
	const imports: string[] = [];
	const pluginsKeys: string[] = [];

	let index = 0;
	for (const plugin of plugins) {
		const pluginKey = `plugin${index}`;
		imports.push(
			`import ${pluginKey} from ${JSON.stringify(plugin.plugin)};`
		);
		pluginsKeys.push(pluginKey);
		index += 1;
	}

	return `
${imports.join('\n')}

export async function setupPlugins(options) {
	${pluginsKeys.map((key) => `await ${key}(options.context);`).join('\n')}
}
	`;
}

export function pluginsPlugin(
	vitelyVueConfig: VitelyVueConfigResolved
): Plugin {
	const clientlugins = vitelyVueConfig.plugins;
	const serverPlugins = vitelyVueConfig.plugins.filter((p) => p.ssr);

	return createVirtualModulesPlugin({
		name: 'vitely:vue-plugins',
		// prettier-ignore
		modules: {
			'virtual:vitely/vue/plugins/server': () => generatePluginModule(serverPlugins),
			'virtual:vitely/vue/plugins/client': () => generatePluginModule(clientlugins),
			'virtual:vitely/vue/plugins': `
				import { setupPlugins as setupPluginsServer } from 'virtual:vitely/vue/plugins/server';
				import { setupPlugins as setupPluginsClient } from 'virtual:vitely/vue/plugins/client';

				export async function setupPlugins(options) {
					const setupPluginsImpl = import.meta.env.SSR ? setupPluginsServer : setupPluginsClient;
					await setupPluginsImpl(options);
				}`
		},
	});
}
