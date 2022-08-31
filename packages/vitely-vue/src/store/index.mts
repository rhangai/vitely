// @ts-ignore
import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import type { VitelyVueConfigResolved } from '../config.mjs';

function moduleStorePinia() {
	return `
import { createPinia } from 'pinia';
import { getVitelyRuntimeContext } from "@vitely/core/runtime";

export function createStore() {
	const store = createPinia();
	if (!import.meta.env.SSR) {
		store.state.value = getVitelyRuntimeContext()?.store;
	}
	return { 
		store,
		storeState() {
			return store.state.value;
		}
	};
}
	`;
}

function moduleStoreNull() {
	return `
export function createStore() {
	return { 
		store: null,
		storeState() {
			return null;
		}
	};
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
