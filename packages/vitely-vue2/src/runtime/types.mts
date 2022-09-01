import type { VitelyCorePlugin, VitelyCoreMiddleware } from '@vitely/core';
import { InjectionKey } from 'vue';
import type { default as VueRouter, RawLocation, Route } from 'vue-router';

type InjectFn = {
	<T>(key: InjectionKey<T>): T;
	(key: symbol | string): any;
};

type ProvideFn = {
	<T>(key: InjectionKey<T>, value: T): void;
	(key: symbol | string, value: unknown): void;
};

export type VitelyVue2MiddlewareContext = {
	router: VueRouter;
	store: any;
	route: Route;
	routeFrom: Route;
	inject: InjectFn;
	next(location: RawLocation): void;
};

export type VitelyVue2PluginContext = {
	router: VueRouter;
	store: any;
	options: Record<string, any>;
	provide: ProvideFn;
	inject: InjectFn;
	onRootSetup(setup: () => void): void;
};

export type VitelyVue2Plugin = VitelyCorePlugin<VitelyVue2PluginContext>;

export type VitelyVue2Middleware =
	VitelyCoreMiddleware<VitelyVue2MiddlewareContext>;
