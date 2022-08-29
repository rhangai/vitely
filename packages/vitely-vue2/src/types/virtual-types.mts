declare module 'virtual:vitely/vue2/app' {
	import { Component } from 'vue';

	export const App: Component;
}

declare module 'virtual:vitely/vue2/head' {
	export function createHead(options: Record<string, any>): {};
}

declare module 'virtual:vitely/vue2/layouts' {
	import type { Component } from 'vue';

	export const Layouts: Record<string, Component>;
}

declare module 'virtual:vitely/vue2/router-data' {
	export const PagesRoot: string;
	export const PagesModules: Record<string, () => unknown>;
	export const PagesMode: 'nuxt2' | 'default';
}

declare module 'virtual:vitely/vue2/router' {
	import type { default as VueRouter, RouteConfig } from 'vue-router';

	export function createRouter(options: Record<string, any>): {
		router: VueRouter;
		routes: RouteConfig[];
	};
}

declare module 'virtual:vitely/vue2/store' {
	import type { Ref } from 'vue';

	type VitelyStore = {
		state: Ref<Record<string, any>>;
	};

	export function createStore(options: Record<string, any>): {
		store: VitelyStore | null;
		storeState(): Record<string, any>;
	};
}
