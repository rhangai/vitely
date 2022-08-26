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

	export function createRouter(): {
		router: VueRouter;
		routes: RouteConfig[];
	};
}

declare module 'virtual:vitely/vue2/store' {
	import type { VueConstructor, Ref } from 'vue';

	type VitelyStore = {
		install(vue: VueConstructor): void;
		state: Ref<Record<string, any>>;
	};

	export function createStore(): {
		store: VitelyStore | null;
	};
}
