import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	VitelyConfig,
	VitelyConfigResolved,
	resolveConfigCore,
} from '@vitely/core/plugins';
import type { HeadObjectPlain } from '@vueuse/head';

export type VitelyVueStore = 'pinia';

export type VitelyVueHead = HeadObjectPlain;

export type VitelyVueConfigResolved = VitelyConfigResolved & {
	ssr: boolean;
	pages: string;
	store: VitelyVueStore | null;
	head: VitelyVueHead;
};

export type VitelyVueConfig = VitelyConfig & {
	pages?: string;
	store?: VitelyVueStore | boolean | null;
	head?: VitelyVueHead | null;
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
	const moduleBase = dirname(fileURLToPath(import.meta.url));
	return {
		...resolveConfigCore(moduleBase, config),
		pages: config?.pages ?? 'pages',
		store: resolveConfigStore(config?.store ?? null),
		head: resolveConfigHead(config?.head ?? null),
	};
}
