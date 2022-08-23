import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import {
	VitelyVueConfigResolved,
	VitelyVueMiddlewareResolved,
} from './config.mjs';

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

export async function runMiddlewares(ctx) {
	${middlewareKeys.map((key) => `await ${key}(ctx);`).join('\n')}
}
	`;
}

function moduleMiddlewaresSsr(vitelyVueConfig: VitelyVueConfigResolved) {
	const ssrMiddlewares = vitelyVueConfig.middlewares.filter((p) => p.ssr);
	return generateMiddlewareModule(ssrMiddlewares);
}

function moduleMiddlewaresClient(vitelyVueConfig: VitelyVueConfigResolved) {
	return generateMiddlewareModule(vitelyVueConfig.middlewares);
}

function moduleMiddlewares() {
	return `
export async function runMiddlewares(app) {
	const { runMiddlewares: runMiddlewaresImpl } = import.meta.env.SSR ? await import('virtual:vitely/vue/middlewares/ssr') : await import('virtual:vitely/vue/middlewares/client');
	await runMiddlewaresImpl(app);
}
	`;
}

export function middlewaresPlugin(
	vitelyVueConfig: VitelyVueConfigResolved
): Plugin {
	return createVirtualModulesPlugin({
		name: 'vitely:vue-plugins',
		// prettier-ignore
		modules: {
			'virtual:vitely/vue/middlewares': () => moduleMiddlewares(),
			'virtual:vitely/vue/middlewares/ssr': () => moduleMiddlewaresSsr(vitelyVueConfig),
			'virtual:vitely/vue/middlewares/client': () => moduleMiddlewaresClient(vitelyVueConfig),
		},
	});
}
