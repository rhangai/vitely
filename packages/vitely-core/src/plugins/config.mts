type VitelyCoreConfigMiddleware =
	| string
	| null
	| undefined
	| {
			ssr?: boolean;
			middleware: string;
	  };

export type VitelyCoreConfigMiddlewareResolved = {
	ssr: boolean;
	middleware: string;
};

type VitelyCoreConfigPlugin =
	| string
	| null
	| undefined
	| {
			ssr?: boolean;
			plugin: string;
	  };

export type VitelyCoreConfigPluginResolved = {
	ssr: boolean;
	plugin: string;
};

export type VitelyCoreConfigServer = {
	standalone?: boolean;
	setup?: string | null;
};

export type VitelyCoreConfigServerResolved = {
	standalone: boolean;
	setup: string | null;
};

export type VitelyCoreConfig = {
	ssr?: boolean | undefined;
	server?: VitelyCoreConfigServer;
	injectEntry?: boolean | string[];
	middlewares?: VitelyCoreConfigMiddleware[] | undefined | null;
	plugins?: VitelyCoreConfigPlugin[] | undefined | null;
};

export type VitelyCoreConfigResolved = {
	moduleBase: string;
	ssr: boolean;
	server: VitelyCoreConfigServerResolved;
	injectEntry: boolean | string[];
	middlewares: VitelyCoreConfigMiddlewareResolved[];
	plugins: VitelyCoreConfigPluginResolved[];
};

/**
 * Resolve the middlewares config
 */
function resolveCoreConfigMiddlewares(
	items: Array<VitelyCoreConfigMiddleware> | null | undefined
): VitelyCoreConfigMiddlewareResolved[] {
	if (!items || items.length <= 0) return [];
	return items
		.map((item): VitelyCoreConfigMiddlewareResolved | null => {
			if (!item) return null;
			if (typeof item === 'string') {
				return { ssr: true, middleware: item };
			}
			if (!item.middleware) return null;
			return { ssr: item.ssr !== false, middleware: item.middleware };
		})
		.filter((p): p is VitelyCoreConfigMiddlewareResolved => {
			if (!p) return false;
			return true;
		});
}

/**
 * Resolve the plugin config
 */
function resolveCoreConfigPlugins(
	items: Array<VitelyCoreConfigPlugin> | null | undefined
): VitelyCoreConfigPluginResolved[] {
	if (!items || items.length <= 0) return [];
	return items
		.map((item): VitelyCoreConfigPluginResolved | null => {
			if (!item) return null;
			if (typeof item === 'string') {
				return { ssr: true, plugin: item };
			}
			if (!item.plugin) return null;
			return { ssr: item.ssr !== false, plugin: item.plugin };
		})
		.filter((p): p is VitelyCoreConfigPluginResolved => {
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
		server: {
			standalone: !!config?.server?.standalone,
			setup: config?.server?.setup ?? null,
		},
		injectEntry: config?.injectEntry ?? true,
		middlewares: resolveCoreConfigMiddlewares(config?.middlewares),
		plugins: resolveCoreConfigPlugins(config?.plugins),
	};
}
