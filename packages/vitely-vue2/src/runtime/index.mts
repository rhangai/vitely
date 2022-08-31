import type {
	VitelyPluginContext,
	VitelyMiddlewareContext,
	VitelyPlugin,
	VitelyMiddleware,
} from '../types.mjs';

export * from './composition/index.mjs';
export * from './router/index.mjs';

export type {
	VitelyPluginContext,
	VitelyMiddlewareContext,
	VitelyPlugin,
	VitelyMiddleware,
};

export function definePlugin(plugin: VitelyPlugin): VitelyPlugin {
	return plugin;
}

export function defineMiddleware(
	middleware: VitelyMiddleware
): VitelyMiddleware {
	return middleware;
}
