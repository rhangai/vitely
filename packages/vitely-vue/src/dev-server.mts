import { join } from 'path';
import { fileURLToPath } from 'url';
import type { Plugin } from 'vite';

export function devServerPlugin(): Plugin {
	return {
		name: 'vitely:vue-dev-server',
		config() {
			return {
				resolve: {
					alias: {
						'virtual:vitely/vue/app.vue': '/app.vue',
					},
				},
			};
		},
		async transformIndexHtml(html, { server, originalUrl }) {
			// if (!config.ssr) return;
			if (!server || !originalUrl) return undefined;
			const serverRenderModule = join(
				fileURLToPath(import.meta.url),
				'../runtime/ssr/server-render.mjs'
			);
			const { render } = await server.ssrLoadModule(serverRenderModule);
			const { renderedHtml } = await render(originalUrl);
			return html.replace('<!-- vue-ssr -->', renderedHtml);
		},
	};
}
