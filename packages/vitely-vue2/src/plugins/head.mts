// @ts-ignore
import { createVirtualModulesPlugin, serializeValue } from '@vitely/core';
import type { Plugin } from 'vite';
import type { VitelyVueConfigResolved } from '../config.mjs';

function moduleHeadVueMeta(vitelyVueConfig: VitelyVueConfigResolved) {
	const headOptions = serializeValue(vitelyVueConfig.head);
	return `
import Vue from 'vue'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)

export function createHead(options) {
	options.metaInfo = ${headOptions};
	return {};
}
	`;
}

export default function headPlugin(
	vitelyVueConfig: VitelyVueConfigResolved
): Plugin {
	return createVirtualModulesPlugin({
		name: 'vitely:vue-head',
		modules: {
			'virtual:vitely/vue2/head': () =>
				moduleHeadVueMeta(vitelyVueConfig),
		},
	});
}
