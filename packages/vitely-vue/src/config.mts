import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	VitelyCoreConfig,
	VitelyCoreConfigResolved,
	resolveCoreConfig,
} from '@vitely/core';
import type { HeadObjectPlain } from '@vueuse/head';

export type VitelyVueStore = 'pinia';

export type VitelyVueHead = HeadObjectPlain;

export type VitelyVueConfigResolved = VitelyCoreConfigResolved & {
	app: string | false;
	ssr: boolean;
	pages: string;
	store: VitelyVueStore | null;
	head: VitelyVueHead;
};

export type VitelyVueConfig = VitelyCoreConfig & {
	app?: string | boolean;
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
 * Resolve a string or false config
 */
function resolveConfigStringFalse(
	configValue: string | boolean | undefined,
	defaultValue: string
): string | false {
	if (configValue === false) return false;
	if (!configValue || configValue === true) return defaultValue;
	return configValue;
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
		app: resolveConfigStringFalse(config?.app, '/app.vue'),
		pages: config?.pages ?? 'pages',
		store: resolveConfigStore(config?.store ?? null),
		head: resolveConfigHead(config?.head ?? null),
	};
}
