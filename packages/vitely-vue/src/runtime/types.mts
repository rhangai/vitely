import type { VitelyCorePlugin, VitelyCoreMiddleware } from '@vitely/core';
import type { HeadClient } from '@vueuse/head';
import type { App } from 'vue';
import type {
	Router,
	RouteLocationRaw,
	RouteLocationNormalized,
} from 'vue-router';

export type VitelyVueMiddlewareContext = {
	router: Router;
	store: any;
	to: RouteLocationNormalized;
	from: RouteLocationNormalized;
	next(location: RouteLocationRaw): void;
};

export type VitelyVuePluginContext = {
	app: App;
	head: HeadClient;
	router: Router;
	store: any;
};

export type VitelyVuePlugin = VitelyCorePlugin<VitelyVuePluginContext>;

export type VitelyVueMiddleware =
	VitelyCoreMiddleware<VitelyVueMiddlewareContext>;
