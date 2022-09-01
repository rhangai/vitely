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

	export type RenderResult<TContext = unknown> =
		| RenderResultRedirect
		| RenderResultNormal<TContext>;

	export type RenderResultRedirect = {
		redirect: string;
		status?: number | null | undefined;
	};

	export type RenderResultNormal<TContext = unknown> = {
		status?: number | null | undefined;
		context: TContext;
		renderParams: RenderParams;
	};

	export type RenderContext = {
		logger: import('@vitely/core').VitelyLogger;
	};

	export type RenderFunction<TContext = unknown> = (
		url: string,
		ctx: RenderContext
	) => Promise<RenderResult<TContext>> | RenderResult<TContext>;

	export const render: RenderFunction;
}

declare module 'virtual:vitely/core/server' {
	import type { FastifyInstance } from 'fastify';

	export function serverSetup(fastify: FastifyInstance): void | Promise<void>;
}
