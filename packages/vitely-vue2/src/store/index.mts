// @ts-ignore
import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import type { VitelyVueConfigResolved } from '../config.mjs';

function moduleStorePinia() {
	return `
import { createPinia, PiniaVuePlugin } from 'pinia';
import Vue from 'vue';

Vue.use(PiniaVuePlugin);
export function createStore(options) {
	const store = createPinia();
	if (!import.meta.env.SSR) {
		store.state.value = (window?.__VITELY__?.context?.store)
	}
	options.pinia = store;
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
			'virtual:vitely/vue2/store':
				vitelyVueConfig.store === 'pinia'
					? moduleStorePinia
					: moduleStoreNull,
		},
	});
}
