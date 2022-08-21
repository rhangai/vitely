/* eslint-disable consistent-return */
import { join } from 'node:path';
import { Plugin, ResolvedConfig } from 'vite';

function createDefaultVueRouter(config: ResolvedConfig) {
	const pagesRoot = '/pages/';
	const pagesGlob = '/pages/**/*.{vue,tsx,ts,jsx,js}';
	return `
import { createMemoryHistory } from 'vue-router';

export const pagesRoot = ${JSON.stringify(pagesRoot)};
export const pagesModules = import.meta.glob(${JSON.stringify(pagesGlob)});
export const createHistory = createMemoryHistory;
	`;
}

export default function vitePluginVueRouter(): Plugin {
	let resolvedConfig: ResolvedConfig;

	const virtualModuleId = 'virtual:@vitely/vite-plugin-router/pages-modules';
	const resolvedVirtualModuleId = `\0${virtualModuleId}`;

	return {
		name: '@vitely/vite-plugin-vue-router',
		configResolved(config) {
			resolvedConfig = config;
		},
		resolveId(id) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId;
			}
		},
		load(id) {
			if (id === resolvedVirtualModuleId) {
				return createDefaultVueRouter(resolvedConfig);
			}
		},
	};
}
