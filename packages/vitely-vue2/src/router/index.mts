import { join } from 'node:path';
import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import { VitelyVueConfigResolved } from '../config.mjs';

function moduleRouterData(vitelyVueConfig: VitelyVueConfigResolved) {
	let pagesRoot = join('/', vitelyVueConfig.pages);
	if (pagesRoot[pagesRoot.length - 1] !== '/') {
		pagesRoot = `${pagesRoot}/`;
	}
	const pagesGlob = join(pagesRoot, '**/*.{vue,tsx,ts,jsx,js}');
	return `
export const pagesRoot = ${JSON.stringify(pagesRoot)};
export const pagesModules = import.meta.glob(${JSON.stringify(pagesGlob)});
	`;
}

function moduleRouter() {
	return `
import { pagesModules, pagesRoot } from 'virtual:vitely/vue2/router-data';
import { default as VueRouter } from 'vue-router';
import { buildRoutesVueRouter } from '@vitely/vue2/router/runtime';
import { default as Vue } from 'vue';

Vue.use(VueRouter);

const { routes } = buildRoutesVueRouter(pagesRoot, pagesModules);

export function createRouter() {
	const router = new VueRouter({
		mode: import.meta.env.SSR ? 'abstract' : 'history',
		routes,
	});
	return { router, routes };
}
	`;
}

export default function routerPlugin(
	vitelyVueConfig: VitelyVueConfigResolved
): Plugin {
	return createVirtualModulesPlugin({
		name: 'vitely:vue-router',
		// prettier-ignore
		modules: {
			'virtual:vitely/vue2/router-data': () => moduleRouterData(vitelyVueConfig),
			'virtual:vitely/vue2/router': moduleRouter,
		},
	});
}
