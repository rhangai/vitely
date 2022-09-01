import type { VitelyVueMiddleware, VitelyVuePlugin } from './types.mjs';

export const definePlugin = (plugin: VitelyVuePlugin) => plugin;
export const defineMiddleware = (middleware: VitelyVueMiddleware) => middleware;
