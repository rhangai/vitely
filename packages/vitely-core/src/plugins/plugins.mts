import type { Plugin as VitePlugin } from 'vite';
import { createVirtualModulesPlugin } from '../virtual-modules.mjs';
import type { VitelyCoreConfigPluginResolved } from './config.mjs';
import type { VitelyCoreOptions } from './options.mjs';

function generatePluginModule(plugins: VitelyCoreConfigPluginResolved[]) {
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

/**
 * A basic
 */
export function pluginsPlugin({ config }: VitelyCoreOptions): VitePlugin {
	const clientlugins = config.plugins;
	const serverPlugins = config.plugins.filter((p) => p.ssr);

	return createVirtualModulesPlugin({
		name: 'vitely:core-plugins',
		// prettier-ignore
		modules: {
			'virtual:vitely/core/plugins/server': () => generatePluginModule(serverPlugins),
			'virtual:vitely/core/plugins/client': () => generatePluginModule(clientlugins),
			'virtual:vitely/core/plugins': `
				import { setupPlugins as setupPluginsServer } from 'virtual:vitely/core/plugins/server';
				import { setupPlugins as setupPluginsClient } from 'virtual:vitely/core/plugins/client';

				export async function setupPlugins(options) {
					const setupPluginsImpl = import.meta.env.SSR ? setupPluginsServer : setupPluginsClient;
					await setupPluginsImpl(options);
				}`
		},
	});
}
