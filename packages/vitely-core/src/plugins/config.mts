type VitelyCoreConfigMiddlewareInput =
	| string
	| null
	| undefined
	| {
			ssr?: boolean;
			middleware: string;
	  };

export type VitelyCoreConfigMiddleware = {
	ssr: boolean;
	middleware: string;
};

type VitelyCoreConfigPluginInput =
	| string
	| null
	| undefined
	| {
			ssr?: boolean;
			plugin: string;
	  };

export type VitelyCoreConfigPlugin = {
	ssr: boolean;
	plugin: string;
};

export type VitelyCoreConfig = {
	ssr?: boolean | undefined;
	standaloneServer?: boolean | undefined;
	middlewares?: VitelyCoreConfigMiddlewareInput[] | undefined | null;
	plugins?: VitelyCoreConfigPluginInput[] | undefined | null;
};

export type VitelyCoreConfigResolved = {
	moduleBase: string;
	ssr: boolean;
	standaloneServer: boolean;
	middlewares: VitelyCoreConfigMiddleware[];
	plugins: VitelyCoreConfigPlugin[];
};

/**
 * Resolve the middlewares config
 */
function resolveCoreConfigMiddlewares(
	items: Array<VitelyCoreConfigMiddlewareInput> | null | undefined
): VitelyCoreConfigMiddleware[] {
	if (!items || items.length <= 0) return [];
	return items
		.map((item): VitelyCoreConfigMiddleware | null => {
			if (!item) return null;
			if (typeof item === 'string') {
				return { ssr: true, middleware: item };
			}
			if (!item.middleware) return null;
			return { ssr: item.ssr !== false, middleware: item.middleware };
		})
		.filter((p): p is VitelyCoreConfigMiddleware => {
			if (!p) return false;
			return true;
		});
}

/**
 * Resolve the plugin config
 */
function resolveCoreConfigPlugins(
	items: Array<VitelyCoreConfigPluginInput> | null | undefined
): VitelyCoreConfigPlugin[] {
	if (!items || items.length <= 0) return [];
	return items
		.map((item): VitelyCoreConfigPlugin | null => {
			if (!item) return null;
			if (typeof item === 'string') {
				return { ssr: true, plugin: item };
			}
			if (!item.plugin) return null;
			return { ssr: item.ssr !== false, plugin: item.plugin };
		})
		.filter((p): p is VitelyCoreConfigPlugin => {
			if (!p) return false;
			return true;
		});
}

/**
 * Resolve the config
 */
export function resolveCoreConfig(
	moduleBase: string,
	config: VitelyCoreConfig | undefined
): VitelyCoreConfigResolved {
	return {
		moduleBase,
		ssr: !!config?.ssr,
		standaloneServer: !!config?.standaloneServer,
		middlewares: resolveCoreConfigMiddlewares(config?.middlewares),
		plugins: resolveCoreConfigPlugins(config?.plugins),
	};
}
