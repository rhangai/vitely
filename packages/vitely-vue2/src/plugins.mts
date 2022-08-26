import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import type { default as VueRouter } from 'vue-router';
import { VitelyVueConfigResolved, VitelyVuePluginResolved } from './config.mjs';

export type VitelyVuePlugin = (
	context: VitelyVuePluginContext
) => void | Promise<void>;

export type VitelyVuePluginContext = {
	router: VueRouter;
	store: any | null;
	options: Record<string, any>;
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
			'virtual:vitely/vue2/plugins/server': () => generatePluginModule(serverPlugins),
			'virtual:vitely/vue2/plugins/client': () => generatePluginModule(clientlugins),
			'virtual:vitely/vue2/plugins': `
				export async function setupPlugins(options) {
					const { setupPlugins: setupPluginsImpl } = import.meta.env.SSR ? await import('virtual:vitely/vue2/plugins/server') : await import('virtual:vitely/vue2/plugins/client');
					await setupPluginsImpl(options);
				}`
		},
	});
}
