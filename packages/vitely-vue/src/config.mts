import {
	VitelyConfigPlugin,
	VitelyConfigPluginInput,
	VitelyConfigMiddleware,
	VitelyConfigMiddlewareInput,
	pluginsPluginResolveConfig,
	middlewaresPluginResolveConfig,
} from '@vitely/core/plugins';
import type { HeadObjectPlain } from '@vueuse/head';

export type VitelyVueStore = 'pinia';

export type VitelyVueHead = HeadObjectPlain;

export type VitelyVueConfigResolved = {
	ssr: boolean;
	pages: string;
	store: VitelyVueStore | null;
	head: VitelyVueHead;
	plugins: VitelyConfigPlugin[];
	middlewares: VitelyConfigMiddleware[];
	standaloneServer: boolean;
};

export type VitelyVueConfig = {
	ssr?: boolean;
	pages?: string;
	store?: VitelyVueStore | boolean | null;
	head?: VitelyVueHead | null;
	plugins?: VitelyConfigPluginInput[];
	middlewares?: VitelyConfigMiddlewareInput[];
	standaloneServer?: boolean;
};

/**
 * Resolve the store configuration
 */
function resolveConfigStore(
	store: VitelyVueStore | boolean | null
): VitelyVueStore | null {
	if (store == null || store === false) return null;
	if (store === true) return 'pinia';
	return store;
}

/**
 * Resolve the store configuration
 */
function resolveConfigHead(head: VitelyVueHead | null): VitelyVueHead {
	return {
		...head,
	};
}

/**
 * Resolve the configuration
 */
export function resolveConfig(
	config: VitelyVueConfig | undefined
): VitelyVueConfigResolved {
	return {
		ssr: !!config?.ssr,
		pages: config?.pages ?? 'pages',
		store: resolveConfigStore(config?.store ?? null),
		head: resolveConfigHead(config?.head ?? null),
		standaloneServer: !!config?.standaloneServer,
		plugins: pluginsPluginResolveConfig(config?.plugins),
		middlewares: middlewaresPluginResolveConfig(config?.middlewares),
	};
}
