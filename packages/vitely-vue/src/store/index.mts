// @ts-ignore
import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import type { VitelyVueConfigResolved } from '../config.mjs';

function moduleStorePinia() {
	return `
import { createPinia } from 'pinia';

export function createStore() {
	const store = createPinia();
	if (!import.meta.env.SSR) {
		store.state.value = (window?.__VITELY__?.context?.store)
	}
	return { store };
}
	`;
}

function moduleStoreNull() {
	return `
export function createStore() {
	return { store: null };
}
	`;
}

export default function storePlugin(
	vitelyVueConfig: VitelyVueConfigResolved
): Plugin {
	return createVirtualModulesPlugin({
		name: 'vitely:vue-store',
		modules: {
			'virtual:vitely/vue/store':
				vitelyVueConfig.store === 'pinia'
					? moduleStorePinia
					: moduleStoreNull,
		},
	});
}
