// @ts-ignore
import type { Plugin, ResolvedConfig } from 'vite';
import { createVirtualModules } from './util.mjs';
import './virtual.mjs';

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
import { pagesModules, pagesRoot, createHistory } from 'virtual:router-data';
import { createRouter as createVueRouter } from 'vue-router';
import { buildRoutesVueRouter } from '@vitely/vite-plugin-vue-router/runtime';

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

export default function vitePluginVueRouter(): Plugin {
	const { load, resolveId, setup } = createVirtualModules<ResolvedConfig>({
		'virtual:router-data': moduleRouterData,
		'virtual:router': moduleRouter,
	});
	return {
		name: '@vitely/vite-plugin-vue-router',
		configResolved: setup,
		resolveId,
		load,
	};
}
