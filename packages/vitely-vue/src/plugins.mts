import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import { VitelyVueConfigResolved, VitelyVuePluginResolved } from './config.mjs';

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

export async function setupPlugins(app) {
	${pluginsKeys.map((key) => `await ${key}(app);`).join('\n')}
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
				export async function setupPlugins(app) {
					const { setupPlugins: setupPluginsImpl } = import.meta.env.SSR ? await import('virtual:vitely/vue/plugins/server') : await import('virtual:vitely/vue/plugins/client');
					await setupPluginsImpl(app);
				}`
		},
	});
}
