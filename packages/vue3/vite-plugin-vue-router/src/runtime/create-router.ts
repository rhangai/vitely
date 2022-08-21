import {
	pagesModules,
	pagesRoot,
	createHistory,
	// eslint-disable-next-line import/no-unresolved
} from 'virtual:@vitely/vite-plugin-router/pages-modules';
import { createRouter as createVueRouter } from 'vue-router';
import { buildRoutesVueRouter } from './build-vue-routes.js';

const { routes } = buildRoutesVueRouter(pagesRoot, pagesModules);

export function createRouter() {
	const router = createVueRouter({
		history: createHistory(),
		routes,
	});
	return { router, routes };
}
