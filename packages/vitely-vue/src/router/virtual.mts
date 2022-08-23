declare module 'virtual:router-data' {
	import type { RouterHistory } from 'vue-router';

	export const pagesRoot: string;
	export const pagesModules: Record<string, () => unknown>;
	export function createHistory(): RouterHistory;
}

declare module 'virtual:router' {
	import type { Router, RouteRecordRaw } from 'vue-router';

	export function createRouter(): {
		router: Router;
		routes: RouteRecordRaw[];
	};
}
