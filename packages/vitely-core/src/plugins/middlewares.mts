import type { Plugin as VitePlugin } from 'vite';
import { createVirtualModulesPlugin } from '../virtual-modules.mjs';

export type VitelyConfigMiddlewareInput =
	| string
	| null
	| undefined
	| {
			ssr?: boolean;
			middleware: string;
	  };

export type VitelyConfigMiddleware = {
	ssr: boolean;
	middleware: string;
};

// prettier-ignore
/**
 * Middleware for vitely
 */
export type VitelyMiddleware<TContext> = (context: TContext) => void | Promise<void>;

/**
 * Middleware options
 */
export type VitelyRunMiddlewaresOptions<TContext> = {
	context: TContext;
	routeChanged(): boolean;
};

function generateMiddlewareModule(middlewares: VitelyConfigMiddleware[]) {
	const imports: string[] = [];
	const middlewareKeys: string[] = [];

	let index = 0;
	for (const middleware of middlewares) {
		const middlewareKey = `middleware${index}`;
		imports.push(
			// prettier-ignore
			`import ${middlewareKey} from ${JSON.stringify(middleware.middleware)};`
		);
		middlewareKeys.push(middlewareKey);
		index += 1;
	}

	return `
${imports.join('\n')}

export async function runMiddlewares(options) {
	${middlewareKeys
		.map((key) => `await ${key}(options.context); `)
		.join('if (options.routeChanged()) return;\n')}
}
	`;
}

/**
 * Plugin to run every middleware
 */
export function middlewaresPlugin(
	middlewares: VitelyConfigMiddleware[]
): VitePlugin {
	const clientMiddlewares = middlewares;
	const serverMiddlewares = middlewares.filter((p) => p.ssr);

	return createVirtualModulesPlugin({
		name: 'vitely:core-middlewares',
		// prettier-ignore
		modules: {
			'virtual:vitely/core/middlewares/server': () => generateMiddlewareModule(serverMiddlewares),
			'virtual:vitely/core/middlewares/client': () => generateMiddlewareModule(clientMiddlewares),
			'virtual:vitely/core/middlewares': `
				import { runMiddlewares as runMiddlewaresServer } from 'virtual:vitely/core/middlewares/server';
				import { runMiddlewares as runMiddlewaresClient } from 'virtual:vitely/core/middlewares/client';
				export async function runMiddlewares(options) {
					const runMiddlewaresImpl = import.meta.env.SSR ? runMiddlewaresServer : runMiddlewaresClient;
					await runMiddlewaresImpl(options);
				}`
		},
	});
}

/**
 * Resolve the middlewares config
 */
export function middlewaresPluginResolveConfig(
	items: Array<VitelyConfigMiddlewareInput> | null | undefined
): VitelyConfigMiddleware[] {
	if (!items || items.length <= 0) return [];
	return items
		.map((item): VitelyConfigMiddleware | null => {
			if (!item) return null;
			if (typeof item === 'string') {
				return { ssr: true, middleware: item };
			}
			if (!item.middleware) return null;
			return { ssr: item.ssr !== false, middleware: item.middleware };
		})
		.filter((p): p is VitelyConfigMiddleware => {
			if (!p) return false;
			return true;
		});
}
