declare module 'virtual:vitely/core/plugins' {
	export function setupPlugins<TContext>(
		options: import('@vitely/core').VitelyCoreSetupPluginsOptions<TContext>
	): Promise<void>;
}

declare module 'virtual:vitely/core/middlewares' {
	export function runMiddlewares<TContext>(
		options: import('@vitely/core').VitelyCoreRunMiddlewaresOptions<TContext>
	): Promise<void>;
}

declare module 'virtual:vitely/core/entry' {
	export {};
}

declare module 'virtual:vitely/core/render' {
	export type RenderItem =
		| Array<string | null | undefined>
		| string
		| null
		| undefined;

	export type RenderParams = {
		htmlAttrs?: RenderItem;
		head?: RenderItem;
		bodyAttrs?: RenderItem;
		bodyPrepend?: RenderItem;
		body?: RenderItem;
		app?: string;
	};

	export type RenderResult = {
		redirect?: string | null | undefined;
		status?: number | null | undefined;
		renderParams: RenderParams;
	};

	export type RenderContext = {
		logger: import('@vitely/core').VitelyLogger;
	};

	export type RenderFunction = (
		url: string,
		ctx: RenderContext
	) => Promise<RenderResult> | RenderResult;

	export const render: RenderFunction;
}
