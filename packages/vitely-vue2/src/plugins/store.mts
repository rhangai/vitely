// @ts-ignore
import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import type {
	VitelyVueConfigResolved,
	VitelyVue2StoreVuex,
	VitelyVue2StorePinia,
} from '../config.mjs';

function moduleStorePinia(_store: VitelyVue2StorePinia) {
	return `
import { createPinia, PiniaVuePlugin } from 'pinia';
import { getVitelyRuntimeContext } from "@vitely/core/runtime";
import Vue from 'vue';

Vue.use(PiniaVuePlugin);
export function createStore(options) {
	const store = createPinia();
	if (!import.meta.env.SSR) {
		store.state.value = getVitelyRuntimeContext()?.store;
	}
	options.pinia = store;
	return {
		store,
		storeState() {
			return store.state.value;
		}
	};
}
	`;
}

function moduleStoreVuex(store: VitelyVue2StoreVuex) {
	if (!store.entry) throw new Error(`Missing store entry point for vuex`);
	return `
import Vue, { computed } from 'vue';
import Vuex from 'vuex';
import { getVitelyRuntimeContext } from "@vitely/core/runtime";
import entry from ${JSON.stringify(store.entry)};

Vue.use(Vuex);

export function createStore(options) {
	const store = new Vuex.Store(entry());
	if (!import.meta.env.SSR) {
		const storeState = getVitelyRuntimeContext()?.store;
		if (storeState)
			store.replaceState(storeState);
	}
	options.store = store;
	return { 
		store,
		storeState() {
			return store.state;
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
		},
	};
}
	`;
}

export default function storePlugin(
	vitelyVueConfig: VitelyVueConfigResolved
): Plugin {
	const getStore = () => {
		const { store } = vitelyVueConfig;
		if (!store) return moduleStoreNull;
		if (store.lib === 'pinia') return () => moduleStorePinia(store);
		if (store.lib === 'vuex') return () => moduleStoreVuex(store);
		throw new Error(`Invalid store configuration`);
	};

	return createVirtualModulesPlugin({
		name: 'vitely:vue-store',
		modules: {
			'virtual:vitely/vue2/store': getStore(),
		},
	});
}
