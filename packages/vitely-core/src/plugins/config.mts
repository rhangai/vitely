export type VitelyConfigMiddlewareInput =
	| string
	| null
	| undefined
	| {
			ssr?: boolean;
			middleware: string;
	  };

export type VitelyConfigMiddleware = {
	ssr: boolean;
	middleware: string;
};

export type VitelyConfigPluginInput =
	| string
	| null
	| undefined
	| {
			ssr?: boolean;
			plugin: string;
	  };

export type VitelyConfigPlugin = {
	ssr: boolean;
	plugin: string;
};

export type VitelyConfig = {
	ssr?: boolean | undefined;
	standaloneServer?: boolean | undefined;
	alias?: Record<string, string> | undefined | null;
	middlewares?: VitelyConfigMiddlewareInput[] | undefined | null;
	plugins?: VitelyConfigPluginInput[] | undefined | null;
};

export type VitelyConfigResolved = {
	moduleBase: string;
	ssr: boolean;
	standaloneServer: boolean;
	alias: Record<string, string>;
	middlewares: VitelyConfigMiddleware[];
	plugins: VitelyConfigPlugin[];
};

/**
 * Resolve the middlewares config
 */
function resolveConfigMiddlewares(
	items: Array<VitelyConfigMiddlewareInput> | null | undefined
): VitelyConfigMiddleware[] {
	if (!items || items.length <= 0) return [];
	return items
		.map((item): VitelyConfigMiddleware | null => {
			if (!item) return null;
			if (typeof item === 'string') {
				return { ssr: true, middleware: item };
			}
			if (!item.middleware) return null;
			return { ssr: item.ssr !== false, middleware: item.middleware };
		})
		.filter((p): p is VitelyConfigMiddleware => {
			if (!p) return false;
			return true;
		});
}

/**
 * Resolve the plugin config
 */
function resolveConfigPlugins(
	items: Array<VitelyConfigPluginInput> | null | undefined
): VitelyConfigPlugin[] {
	if (!items || items.length <= 0) return [];
	return items
		.map((item): VitelyConfigPlugin | null => {
			if (!item) return null;
			if (typeof item === 'string') {
				return { ssr: true, plugin: item };
			}
			if (!item.plugin) return null;
			return { ssr: item.ssr !== false, plugin: item.plugin };
		})
		.filter((p): p is VitelyConfigPlugin => {
			if (!p) return false;
			return true;
		});
}

/**
 * Resolve the config
 */
export function resolveConfigCore(
	moduleBase: string,
	config: VitelyConfig | undefined
): VitelyConfigResolved {
	return {
		moduleBase,
		ssr: !!config?.ssr,
		standaloneServer: !!config?.standaloneServer,
		alias: { ...config?.alias },
		middlewares: resolveConfigMiddlewares(config?.middlewares),
		plugins: resolveConfigPlugins(config?.plugins),
	};
}
