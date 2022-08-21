/* eslint-disable consistent-return */
import { join } from 'node:path';
import { Plugin, ResolvedConfig } from 'vite';

function createDefaultVueRouter(config: ResolvedConfig) {
	const pagesRoot = '';
	const pagesGlob = join(pagesRoot, '**/*.{vue,tsx,ts,jsx,js}');
	return `
		import { createMemoryHistory as createHistory } from 'vue-router';
		
		const pagesRoot = ${JSON.stringify(pagesRoot)};
		const pagesModule = import.meta.glob(${JSON.stringify(pagesGlob)})
		export { 
			createHistory,
			pagesRoot,
			pagesModule,
		};
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
