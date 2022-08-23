import { join } from 'path';
import { fileURLToPath } from 'url';
import type { Plugin, ResolvedConfig } from 'vite';

export function devServerPlugin(): Plugin {
	let config: ResolvedConfig | null = null;
	return {
		name: 'vitely:vue-dev-server',
		configResolved(configResolved) {
			config = configResolved;
		},
		async transformIndexHtml(html, { server, originalUrl }) {
			if (config?.command !== 'serve') return undefined;
			if (!server || !originalUrl) return undefined;
			const serverRenderModule = join(
				fileURLToPath(import.meta.url),
				'../entry/ssr/server-render.mjs'
			);
			const { render } = await server.ssrLoadModule(serverRenderModule);
			const ssrContext = {};
			const { renderedHtml } = await render(originalUrl, ssrContext);
			return {
				html: html.replace('<!-- vue-ssr -->', renderedHtml),
				tags: [],
			};
		},
	};
}
