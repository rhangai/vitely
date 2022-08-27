export type VitelyVue2StorePinia = {
	lib: 'pinia';
};

export type VitelyVue2StoreVuex = {
	lib: 'vuex';
	entry: string;
};

export type VitelyVue2Store = VitelyVue2StorePinia | VitelyVue2StoreVuex;

export type VitelyVuePluginResolved = {
	ssr: boolean;
	plugin: string;
};

export type VitelyVueMiddlewareResolved = {
	ssr: boolean;
	middleware: string;
};

export type VitelyVueConfigResolved = {
	ssr: boolean;
	store: VitelyVue2Store | null;
	plugins: VitelyVuePluginResolved[];
	pages: string;
	middlewares: VitelyVueMiddlewareResolved[];
	standaloneServer: boolean;
};

export type VitelyVueMiddleware =
	| string
	| { ssr?: boolean; middleware: string };
export type VitelyVuePlugin = string | { ssr?: boolean; plugin: string };

export type VitelyVueConfig = {
	ssr?: boolean;
	store?: VitelyVue2Store | boolean | null;
	plugins?: VitelyVuePlugin[];
	pages?: string;
	middlewares?: VitelyVueMiddleware[];
	standaloneServer?: boolean;
};

/**
 * Resolve the plugins
 */
function resolveConfigArray<T, U>(
	items: Array<T | undefined | null> | undefined | null,
	cb: (item: T) => U | null
): U[] {
	if (!items || items.length <= 0) return [];
	return items
		.map((item): U | null => {
			if (!item) return null;
			return cb(item);
		})
		.filter((p): p is U => {
			if (!p) return false;
			return true;
		});
}

/**
 * Resolve the store configuration
 */
function resolveConfigStore(
	store: VitelyVue2Store | boolean | null
): VitelyVue2Store | null {
	if (store == null || store === false) return null;
	if (store === true) return { lib: 'pinia' };
	return store;
}

/**
 * Resolve the configuration
 */
export function resolveConfig(
	config: VitelyVueConfig | undefined
): VitelyVueConfigResolved {
	return {
		ssr: !!config?.ssr,
		store: resolveConfigStore(config?.store ?? null),
		pages: config?.pages ?? 'pages',
		standaloneServer: !!config?.standaloneServer,
		plugins: resolveConfigArray(
			config?.plugins,
			(item): VitelyVuePluginResolved | null => {
				if (typeof item === 'string')
					return { ssr: true, plugin: item };
				if (!item.plugin) return null;
				return {
					ssr: item.ssr !== false,
					plugin: item.plugin,
				};
			}
		),
		middlewares: resolveConfigArray(
			config?.middlewares,
			(item): VitelyVueMiddlewareResolved | null => {
				if (typeof item === 'string')
					return { ssr: true, middleware: item };
				if (!item.middleware) return null;
				return {
					ssr: item.ssr !== false,
					middleware: item.middleware,
				};
			}
		),
	};
}
