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
import { createMemoryHistory, createWebHistory } from 'vue-router';

export const pagesRoot = ${JSON.stringify(pagesRoot)};
export const pagesModules = import.meta.glob(${JSON.stringify(pagesGlob)});
export const createHistory = import.meta.env.SSR ? createMemoryHistory : createWebHistory;
	`;
}

function moduleRouter() {
	return `
import { pagesModules, pagesRoot, createHistory } from 'virtual:vitely/vue/router-data';
import { createRouter as createVueRouter } from 'vue-router';
import { buildRoutesVueRouter } from '@vitely/vue/router/runtime';

const { routes } = buildRoutesVueRouter(pagesRoot, pagesModules);

export function createRouter() {
	const router = createVueRouter({
		history: createHistory(),
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
			'virtual:vitely/vue/router-data': () => moduleRouterData(vitelyVueConfig),
			'virtual:vitely/vue/router': moduleRouter,
		},
	});
}
