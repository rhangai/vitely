import type { VitelyCorePlugin, VitelyCoreMiddleware } from '@vitely/core';
import type { default as VueRouter, RawLocation, Route } from 'vue-router';

export type VitelyMiddlewareContext = {
	router: VueRouter;
	store: any;
	to: Route;
	from: Route;
	next(location: RawLocation): void;
};

export type VitelyPluginContext = {
	router: VueRouter;
	store: any;
	options: Record<string, any>;
	provide(key: string | symbol, value: unknown): void;
	onAppSetup(setup: () => void): void;
};

export type VitelyPlugin = VitelyCorePlugin<VitelyPluginContext>;

export type VitelyMiddleware = VitelyCoreMiddleware<VitelyMiddlewareContext>;
