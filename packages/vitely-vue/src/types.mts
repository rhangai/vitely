import type { VitelyCorePlugin, VitelyCoreMiddleware } from '@vitely/core';
import type { HeadClient } from '@vueuse/head';
import type { App } from 'vue';
import type {
	Router,
	RouteLocationRaw,
	RouteLocationNormalized,
} from 'vue-router';

export type VitelyMiddlewareContext = {
	router: Router;
	store: any;
	to: RouteLocationNormalized;
	from: RouteLocationNormalized;
	next(location: RouteLocationRaw): void;
};

export type VitelyPluginContext = {
	app: App;
	head: HeadClient;
	router: Router;
	store: any;
};

export type VitelyPlugin = VitelyCorePlugin<VitelyPluginContext>;

export type VitelyMiddleware = VitelyCoreMiddleware<VitelyMiddlewareContext>;
