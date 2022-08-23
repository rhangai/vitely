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

function modulePluginsSsr(vitelyVueConfig: VitelyVueConfigResolved) {
	const ssrPlugins = vitelyVueConfig.plugins.filter((p) => p.ssr);
	return generatePluginModule(ssrPlugins);
}

function modulePluginsClient(vitelyVueConfig: VitelyVueConfigResolved) {
	return generatePluginModule(vitelyVueConfig.plugins);
}

function modulePlugins() {
	return `
export async function setupPlugins(app) {
	const { setupPlugins: setupPluginsImpl } = import.meta.env.SSR ? await import('virtual:vitely/vue/plugins/ssr') : await import('virtual:vitely/vue/plugins/client');
	await setupPluginsImpl(app);
}
	`;
}

export function pluginsPlugin(
	vitelyVueConfig: VitelyVueConfigResolved
): Plugin {
	return createVirtualModulesPlugin({
		name: 'vitely:vue-plugins',
		// prettier-ignore
		modules: {
			'virtual:vitely/vue/plugins': () => modulePlugins(),
			'virtual:vitely/vue/plugins/ssr': () => modulePluginsSsr(vitelyVueConfig),
			'virtual:vitely/vue/plugins/client': () => modulePluginsClient(vitelyVueConfig),
		},
	});
}
