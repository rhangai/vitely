import type { Plugin as VitePlugin } from 'vite';
import { createVirtualModulesPlugin } from '../virtual-modules.mjs';

export type VitelyConfigPluginInput =
	| string
	| null
	| undefined
	| VitelyConfigPlugin;

export type VitelyConfigPlugin = {
	ssr: boolean;
	plugin: string;
};

// prettier-ignore
/**
 * Plugin configuration
 */
export type VitelyPlugin<TContext> = (context: TContext) => void | Promise<void>;

/**
 * Middleware options
 */
export type VitelySetupPluginsOptions<TContext> = {
	context: TContext;
};

function generatePluginModule(plugins: VitelyConfigPlugin[]) {
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
export function pluginsPlugin(plugins: VitelyConfigPlugin[]): VitePlugin {
	const clientlugins = plugins;
	const serverPlugins = plugins.filter((p) => p.ssr);

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

/**
 * Resolve the plugins config
 */
export function pluginsPluginResolveConfig(
	items: Array<VitelyConfigPluginInput>
): VitelyConfigPlugin[] {
	if (!items || items.length <= 0) return [];
	return items
		.map((item): VitelyConfigPlugin | null => {
			if (!item) return null;
			if (typeof item === 'string') {
				return { ssr: true, plugin: item };
			}
			if (!item.plugin) return null;
			return { ...item };
		})
		.filter((p): p is VitelyConfigPlugin => {
			if (!p) return false;
			return true;
		});
}
