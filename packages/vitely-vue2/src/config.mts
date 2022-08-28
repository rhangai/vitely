import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	VitelyCoreConfig,
	VitelyCoreConfigResolved,
	resolveCoreConfig,
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

export type VitelyVueConfigResolved = VitelyCoreConfigResolved & {
	pages: string;
	store: VitelyVue2Store | null;
	head: VitelyVue2Head;
};

export type VitelyVueConfig = VitelyCoreConfig & {
	pages?: string;
	store?: VitelyVue2Store | boolean | null;
	head?: VitelyVue2Head | null;
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
	const moduleBase = dirname(fileURLToPath(import.meta.url));
	return {
		...resolveCoreConfig(moduleBase, config),
		pages: config?.pages ?? 'pages',
		store: resolveConfigStore(config?.store ?? null),
		head: resolveConfigHead(config?.head ?? null),
	};
}
