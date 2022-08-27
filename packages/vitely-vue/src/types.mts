declare module 'virtual:vitely/vue/app.vue' {
	import { Component } from 'vue';

	const vitelyMainComponent: Component;
	export default vitelyMainComponent;
}

declare module 'virtual:vitely/vue/plugins' {
	export function setupPlugins(
		options: import('./plugins.mjs').VitelyVuePluginOptions
	): Promise<void>;
}

declare module 'virtual:vitely/vue/middlewares' {
	export function runMiddlewares(
		options: import('./middleware.mjs').VitelyVueMiddlewareOptions
	): Promise<void>;
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
