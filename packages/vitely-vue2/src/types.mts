declare module 'virtual:vitely/vue2/app.vue' {
	import { Component } from 'vue';

	const vitelyMainComponent: Component;
	export default vitelyMainComponent;
}

declare module 'virtual:vitely/vue2/plugins' {
	export function setupPlugins(
		options: import('./plugins.mjs').VitelyVuePluginOptions
	): Promise<void>;
}

declare module 'virtual:vitely/vue2/middlewares' {
	export function runMiddlewares(
		options: import('./middleware.mjs').VitelyVueMiddlewareOptions
	): Promise<void>;
}

declare module 'virtual:vitely/vue2/router-data' {
	export const pagesRoot: string;
	export const pagesModules: Record<string, () => unknown>;
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

declare module 'virtual:vitely/vue2/head' {
	export function createHead(options: Record<string, any>): {};
}
