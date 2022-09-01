// @ts-ignore
import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import type { VitelyVueConfigResolved } from '../config.mjs';

function moduleApp(config: VitelyVueConfigResolved) {
	const defaultComponent = `{
	render() {
		return h(RouterView);
	}
}`;

	// No app file will be used
	if (config.app === false) {
		return `export const App = ${defaultComponent};`;
	}

	const appFile = JSON.stringify(config.app);
	return `
import { defineComponent, h } from 'vue';
import { RouterView } from 'vue-router';

const AppGlob = import.meta.glob(${appFile}, { eager: true });
export const App = AppGlob[${appFile}]?.default ?? defineComponent(${defaultComponent});
	`;
}

export default function appPlugin(config: VitelyVueConfigResolved): Plugin {
	return createVirtualModulesPlugin({
		name: 'vitely:vue-app',
		modules: {
			'virtual:vitely/vue/app': () => moduleApp(config),
		},
	});
}
