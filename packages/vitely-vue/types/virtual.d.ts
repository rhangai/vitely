declare module 'virtual:vitely/vue/app' {
	import { Component } from 'vue';

	export const App: Component;
}

declare module 'virtual:vitely/vue/router-data' {
	import type { RouterHistory } from 'vue-router';

	export const pagesRoot: string;
	export const pagesModules: Record<string, () => unknown>;
	export function createHistory(): RouterHistory;
}

declare module 'virtual:vitely/vue/router' {
	import type { Router, RouteRecordRaw } from 'vue-router';

	export function createRouter(): {
		router: Router;
		routes: RouteRecordRaw[];
	};
}

declare module 'virtual:vitely/vue/store' {
	import type { App, Ref } from 'vue';

	type VitelyStore = {
		install(vue: App): void;
		state: Ref<Record<string, any>>;
	};

	export function createStore(): {
		store: VitelyStore | null;
		storeState(): any;
	};
}

declare module 'virtual:vitely/vue/head' {
	import type { HeadClient } from '@vueuse/head';

	export function createHead(): {
		head: HeadClient;
	};
}
