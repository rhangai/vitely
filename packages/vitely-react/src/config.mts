import {
	VitelyConfigMiddleware,
	VitelyConfigPlugin,
} from '@vitely/core/plugins';

export type VitelyReactConfigResolved = {
	ssr: boolean;
	pages: string;
	plugins: VitelyConfigPlugin[];
	middlewares: VitelyConfigMiddleware[];
	standaloneServer: boolean;
};

export type VitelyReactConfig = {
	ssr?: boolean;
	pages?: string;
	plugins?: Array<string | VitelyConfigPlugin>;
	middlewares?: Array<string | VitelyConfigMiddleware>;
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
 * Resolve the configuration
 */
export function resolveConfig(
	config: VitelyReactConfig | undefined
): VitelyReactConfigResolved {
	return {
		ssr: !!config?.ssr,
		pages: config?.pages ?? 'pages',
		standaloneServer: !!config?.standaloneServer,
		plugins: resolveConfigArray(
			config?.plugins,
			(item): VitelyConfigPlugin | null => {
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
			(item): VitelyConfigMiddleware | null => {
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
