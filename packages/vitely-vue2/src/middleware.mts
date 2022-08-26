import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import { RawLocation, Route } from 'vue-router';
import {
	VitelyVueConfigResolved,
	VitelyVueMiddlewareResolved,
} from './config.mjs';

export type VitelyVueMiddleware = (
	context: VitelyVueMiddlewareContext
) => void | Promise<void>;

export type VitelyVueMiddlewareContext = {
	to: Route;
	from: Route;
	store: any;
	next(location: RawLocation): void;
};

export type VitelyVueMiddlewareOptions = {
	context: VitelyVueMiddlewareContext;
	routeChanged(): boolean;
};

function generateMiddlewareModule(plugins: VitelyVueMiddlewareResolved[]) {
	const imports: string[] = [];
	const middlewareKeys: string[] = [];

	let index = 0;
	for (const middleware of plugins) {
		const middlewareKey = `middleware${index}`;
		imports.push(
			`import ${middlewareKey} from ${JSON.stringify(
				middleware.middleware
			)};`
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
	vitelyVueConfig: VitelyVueConfigResolved
): Plugin {
	const clientMiddlewares = vitelyVueConfig.middlewares;
	const serverMiddlewares = vitelyVueConfig.middlewares.filter((p) => p.ssr);

	return createVirtualModulesPlugin({
		name: 'vitely:vue-plugins',
		// prettier-ignore
		modules: {
			'virtual:vitely/vue2/middlewares/server': () => generateMiddlewareModule(serverMiddlewares),
			'virtual:vitely/vue2/middlewares/client': () => generateMiddlewareModule(clientMiddlewares),
			'virtual:vitely/vue2/middlewares': `
				export async function runMiddlewares(options) {
					const { runMiddlewares: runMiddlewaresImpl } = import.meta.env.SSR ? await import('virtual:vitely/vue2/middlewares/server') : await import('virtual:vitely/vue2/middlewares/client');
					await runMiddlewaresImpl(options);
				}`
		},
	});
}
