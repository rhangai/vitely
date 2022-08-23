import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';
import {
	VitelyVueConfigResolved,
	VitelyVueMiddlewareResolved,
} from './config.mjs';

export type VitelyMiddleware = (
	context: VitelyMiddlewareContext
) => void | Promise<void>;

export type VitelyMiddlewareContext = {
	to: RouteLocationNormalized;
	from: RouteLocationNormalized;
	next(location: RouteLocationRaw): void;
};

export type VitelyMiddlewareOptions = {
	context: VitelyMiddlewareContext;
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
			'virtual:vitely/vue/middlewares/server': () => generateMiddlewareModule(serverMiddlewares),
			'virtual:vitely/vue/middlewares/client': () => generateMiddlewareModule(clientMiddlewares),
			'virtual:vitely/vue/middlewares': `
				export async function runMiddlewares(options) {
					const { runMiddlewares: runMiddlewaresImpl } = import.meta.env.SSR ? await import('virtual:vitely/vue/middlewares/server') : await import('virtual:vitely/vue/middlewares/client');
					await runMiddlewaresImpl(options);
				}`
		},
	});
}
