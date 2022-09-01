import type { VitelyVue2Middleware, VitelyVue2Plugin } from './types.mjs';

export const definePlugin = (plugin: VitelyVue2Plugin) => plugin;
export const defineMiddleware = (middleware: VitelyVue2Middleware) =>
	middleware;
