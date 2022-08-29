// @ts-ignore
import { createVirtualModulesPlugin } from '@vitely/core';
import type { Plugin } from 'vite';
import type { VitelyVueConfigResolved } from '../config.mjs';

function moduleApp(_config: VitelyVueConfigResolved) {
	return `
import { defineComponent } from 'vue';

const AppGlob = import.meta.glob('/app.vue', { eager: true });
export const App = AppGlob['/app.vue']?.default ?? defineComponent({
	render(h) {
		if (process.env.VITELY_VUE2_USE_COMPONENTS) {
			return h('vitely-layout-manager', {}, [h('router-view')]);
		}
		return h('router-view');
	}
});
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
