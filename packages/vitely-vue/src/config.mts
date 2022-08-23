export type VitelyVuePluginResolved = {
	ssr: boolean;
	plugin: string;
};

export type VitelyVueConfigResolved = {
	ssr: boolean;
	plugins: VitelyVuePluginResolved[];
	standaloneServer: boolean;
};

export type VitelyVuePlugin = string | { ssr?: boolean; plugin: string };

export type VitelyVueConfig = {
	ssr?: boolean;
	plugins?: VitelyVuePlugin[];
	standaloneServer?: boolean;
};

/**
 * Resolve the plugins
 */
function resolveConfigPlugins(
	plugins: VitelyVuePlugin[] | undefined
): VitelyVuePluginResolved[] {
	if (!plugins || plugins.length <= 0) return [];

	return plugins
		.map((plugin): VitelyVuePluginResolved | null => {
			if (!plugin) return null;
			if (typeof plugin === 'string') {
				return { ssr: true, plugin };
			}
			return {
				ssr: plugin.ssr !== false,
				plugin: plugin.plugin,
			};
		})
		.filter((p): p is VitelyVuePluginResolved => {
			if (!p) return false;
			if (!p.plugin) return false;
			return true;
		});
}

/**
 * Resolve the configuration
 */
export function resolveConfig(
	config: VitelyVueConfig | undefined
): VitelyVueConfigResolved {
	return {
		ssr: config?.ssr !== false,
		standaloneServer: !!config?.standaloneServer,
		plugins: resolveConfigPlugins(config?.plugins),
	};
}
