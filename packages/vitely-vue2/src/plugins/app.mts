// @ts-ignore
import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import type { VitelyVueConfigResolved } from '../config.mjs';

function moduleApp(config: VitelyVueConfigResolved) {
	const defaultComponent = `{
	render(h) {
		if (process.env.VITELY_VUE2_USE_COMPONENTS) {
			return h('vitely-layout-manager', {}, [h('router-view')]);
		}
		return h('router-view');
	}
}`;

	// No app file will be used
	if (config.app === false) {
		return `export const App = ${defaultComponent};`;
	}

	const appFile = JSON.stringify(config.app);
	return `
import { defineComponent } from 'vue';

const AppGlob = import.meta.glob(${appFile}, { eager: true });
export const App = AppGlob[${appFile}]?.default ?? defineComponent(${defaultComponent});
	`;
}

export default function appPlugin(config: VitelyVueConfigResolved): Plugin {
	return createVirtualModulesPlugin({
		name: 'vitely:vue-app',
		modules: {
			'virtual:vitely/vue2/app': () => moduleApp(config),
		},
	});
}
