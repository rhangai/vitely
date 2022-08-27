// @ts-ignore
import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import type { VitelyVueConfigResolved } from '../config.mjs';

function moduleHeadVueMeta() {
	return `
import Vue from 'vue'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)

export function createHead(options) {
	options.metaInfo = {
      title: 'Default Title',
      titleTemplate: '%s | My Awesome Webapp'
	};
	return {};
}
	`;
}

export default function headPlugin(
	_vitelyVueConfig: VitelyVueConfigResolved
): Plugin {
	return createVirtualModulesPlugin({
		name: 'vitely:vue-head',
		modules: {
			'virtual:vitely/vue2/head': moduleHeadVueMeta,
		},
	});
}
