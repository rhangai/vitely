declare module 'virtual:vitely/core/plugins' {
	export function setupPlugins<TContext>(
		options: import('./plugins.mjs').VitelySetupPluginsOptions<TContext>
	): Promise<void>;
}

declare module 'virtual:vitely/core/middlewares' {
	export function runMiddlewares<TContext>(
		options: import('./middlewares.mjs').VitelyRunMiddlewaresOptions<TContext>
	): Promise<void>;
}
