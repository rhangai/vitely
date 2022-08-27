// @ts-ignore
import { createVirtualModulesPlugin, serializeValue } from '@vitely/core';
import type { Plugin } from 'vite';
import type { VitelyVueConfigResolved } from '../config.mjs';

function moduleHeadVueMeta(vitelyVueConfig: VitelyVueConfigResolved) {
	const headOptions = serializeValue(vitelyVueConfig.head);

	const updateHead = `if (typeof window !== 'undefined') head.updateDOM();`;
	return `
import { createHead as createVueuseHead } from "@vueuse/head"

export function createHead(options) {
	const head = createVueuseHead(${headOptions});
	${!vitelyVueConfig.ssr ? updateHead : ''}
	return { head };
}
	`;
}

export default function headPlugin(
	vitelyVueConfig: VitelyVueConfigResolved
): Plugin {
	return createVirtualModulesPlugin({
		name: 'vitely:vue-head',
		modules: {
			'virtual:vitely/vue/head': () => moduleHeadVueMeta(vitelyVueConfig),
		},
	});
}
