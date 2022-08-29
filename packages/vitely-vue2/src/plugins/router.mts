import { join } from 'node:path';
import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import { VitelyVueConfigResolved } from '../config.mjs';

function moduleRouterData(config: VitelyVueConfigResolved) {
	let pagesRoot = join('/', config.pages);
	if (pagesRoot[pagesRoot.length - 1] !== '/') {
		pagesRoot = `${pagesRoot}/`;
	}
	const pagesGlob = join(pagesRoot, '**/*.{vue,tsx,ts,jsx,js}');

	let pagesMode = 'default';
	if (config.shim.nuxt2) {
		pagesMode = 'nuxt2';
	}
	return `
export const PagesRoot = ${JSON.stringify(pagesRoot)};
export const PagesModules = import.meta.glob(${JSON.stringify(pagesGlob)});
export const PagesMode = ${JSON.stringify(pagesMode)};
	`;
}

function moduleRouter() {
	return `
import { PagesModules, PagesRoot, PagesMode } from 'virtual:vitely/vue2/router-data';
import { default as VueRouter } from 'vue-router';
import { buildRoutesVueRouter } from '@vitely/vue2/runtime';
import { default as Vue } from 'vue';

Vue.use(VueRouter);

const { routes } = buildRoutesVueRouter(PagesRoot, PagesModules, PagesMode);

export function createRouter(options) {
	const router = new VueRouter({
		mode: import.meta.env.SSR ? 'abstract' : 'history',
		routes,
	});
	options.router = router;
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
