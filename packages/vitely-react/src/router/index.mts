import { join } from 'node:path';
import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import { VitelyReactConfigResolved } from '../config.mjs';

function moduleRouterData(config: VitelyReactConfigResolved) {
	let pagesRoot = join('/', config.pages);
	if (pagesRoot[pagesRoot.length - 1] !== '/') {
		pagesRoot = `${pagesRoot}/`;
	}
	const pagesGlob = join(pagesRoot, '**/*.{tsx,ts,jsx,js}');
	// prettier-ignore
	return `
import { BrowserRouter } from 'react-router-dom';
import { StaticRouter } from "react-router-dom/server";

export const pagesRoot = ${JSON.stringify(pagesRoot)};
export const pagesModules = import.meta.glob(${JSON.stringify(pagesGlob)});
export const Router = import.meta.env.SSR ? StaticRouter : BrowserRouter;
	`;
}
export default function routerPlugin(
	config: VitelyReactConfigResolved
): Plugin {
	return createVirtualModulesPlugin({
		name: 'vitely:react-router',
		// prettier-ignore
		modules: {
			'virtual:vitely/react/router-data': () => moduleRouterData(config),
		},
	});
}
