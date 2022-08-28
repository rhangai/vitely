declare module 'virtual:vitely/core/plugins' {
	export function setupPlugins<TContext>(
		options: import('../plugins/plugins.mjs').VitelyCoreSetupPluginsOptions<TContext>
	): Promise<void>;
}

declare module 'virtual:vitely/core/middlewares' {
	export function runMiddlewares<TContext>(
		options: import('../plugins/middlewares.mjs').VitelyCoreRunMiddlewaresOptions<TContext>
	): Promise<void>;
}

declare module 'virtual:vitely/core/entry' {
	export {};
}

declare module 'virtual:vitely/core/render' {
	export type RenderResult = {
		redirect?: string | null | undefined;
		status?: number | null | undefined;
		renderParams: import('../server/html-ssr-render.mjs').HtmlSsrRenderParams;
	};

	export type RenderContext = {
		logger: import('./types.mjs').VitelyLogger;
	};

	export type RenderFunction = (
		url: string,
		ctx: RenderContext
	) => Promise<RenderResult> | RenderResult;
	export const render: RenderFunction;
}
