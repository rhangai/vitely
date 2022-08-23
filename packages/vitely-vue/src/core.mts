import { Plugin } from 'vite';

export default function vitelyPluginVueCore(): Plugin {
	return {
		name: 'vitely:vue',
		config() {
			return {
				resolve: {
					alias: {
						'virtual:vitely/vue/app.vue': '/app.vue',
						'@vitely/vue/entry': '@vitely/vue/entry/ssr/client',
					},
				},
			};
		},
	};
}
