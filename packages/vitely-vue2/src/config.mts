import {
	VitelyConfigPlugin,
	VitelyConfigPluginInput,
	VitelyConfigMiddleware,
	VitelyConfigMiddlewareInput,
	pluginsPluginResolveConfig,
	middlewaresPluginResolveConfig,
} from '@vitely/core/plugins';
import { type MetaInfo } from 'vue-meta';

export type VitelyVue2StorePinia = {
	lib: 'pinia';
};

export type VitelyVue2StoreVuex = {
	lib: 'vuex';
	entry: string;
};

export type VitelyVue2Store = VitelyVue2StorePinia | VitelyVue2StoreVuex;

export type VitelyVue2Head = Pick<
	MetaInfo,
	| 'title'
	| 'titleTemplate'
	| 'htmlAttrs'
	| 'meta'
	| 'link'
	| 'script'
	| 'style'
	| 'noscript'
>;

export type VitelyVueConfigResolved = {
	ssr: boolean;
	pages: string;
	store: VitelyVue2Store | null;
	head: VitelyVue2Head;
	plugins: VitelyConfigPlugin[];
	middlewares: VitelyConfigMiddleware[];
	standaloneServer: boolean;
};

export type VitelyVueConfig = {
	ssr?: boolean;
	pages?: string;
	store?: VitelyVue2Store | boolean | null;
	head?: VitelyVue2Head | null;
	plugins?: VitelyConfigPluginInput[];
	middlewares?: VitelyConfigMiddlewareInput[];
	standaloneServer?: boolean;
};

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
 * Resolve the store configuration
 */
function resolveConfigHead(head: VitelyVue2Head | null): VitelyVue2Head {
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
