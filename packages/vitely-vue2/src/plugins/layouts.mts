// @ts-ignore
import { join } from 'node:path';
import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import type { VitelyVueConfigResolved } from '../config.mjs';

function moduleLayouts(config: VitelyVueConfigResolved) {
	if (!config.layouts) {
		return `export const Layouts = {}`;
	}

	let layoutsRoot = join('/', config.layouts);
	if (layoutsRoot[layoutsRoot.length - 1] !== '/') {
		layoutsRoot = `${layoutsRoot}/`;
	}
	const layoutsGlob = join(layoutsRoot, '*.{vue,tsx,ts,jsx,js}');
	return `
export const Layouts = parseLayout();

function parseLayout() {
	const layoutDir = ${JSON.stringify(layoutsRoot)};
	const layoutImports = import.meta.glob(
		${JSON.stringify(layoutsGlob)},
		{
			eager: true,
		}
	);

	// No layouts files
	if (Object.keys(layoutImports).length <= 0) {
		const layoutDefault = {
			render(h) {
				return h('div', {}, this.$slots.default);
			}
		};
		return { default: layoutDefault };
	}

	const layouts = {};
	// Loop through every layout
	for (const key in layoutImports) {
		const layoutComponent =
			layoutImports[key].default ?? layoutImports[key];
		const basename = key.substring(layoutDir.length);
		const extensionSeparator = basename.indexOf('.');
		const name = basename.substring(0, extensionSeparator);
		layouts[name] = layoutComponent;
	}
	return layouts;
}

	`;
}

export default function layoutsPlugin(config: VitelyVueConfigResolved): Plugin {
	return createVirtualModulesPlugin({
		name: 'vitely:vue-layout',
		modules: {
			'virtual:vitely/vue2/layouts': () => moduleLayouts(config),
		},
	});
}
