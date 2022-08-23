// @ts-ignore
import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';

function moduleRouterData() {
	const pagesRoot = '/pages/';
	const pagesGlob = '/pages/**/*.{vue,tsx,ts,jsx,js}';
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

export default function routerPlugin(): Plugin {
	return createVirtualModulesPlugin({
		name: 'vitely:vue-router',
		modules: {
			'virtual:vitely/vue/router-data': moduleRouterData,
			'virtual:vitely/vue/router': moduleRouter,
		},
	});
}
