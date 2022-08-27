declare module 'virtual:vitely/core/plugins' {
	export function setupPlugins<TContext>(
		options: import('./plugins/plugins.mjs').VitelySetupPluginsOptions<TContext>
	): Promise<void>;
}

declare module 'virtual:vitely/core/middlewares' {
	export function runMiddlewares<TContext>(
		options: import('./plugins/middlewares.mjs').VitelyRunMiddlewaresOptions<TContext>
	): Promise<void>;
}

declare module 'virtual:vitely/core/entry' {
	export {};
}

declare module 'virtual:vitely/core/render' {
	export type RenderResult = {
		redirect?: string | null | undefined;
		status?: number | null | undefined;
		renderParams: import('./server/html-ssr-render.mjs').HtmlSsrRenderParams;
	};
	export function render(url: string): Promise<RenderResult> | RenderResult;
}
