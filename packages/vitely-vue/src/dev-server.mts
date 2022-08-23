import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import type { Plugin } from 'vite';
import { VitelyVueConfigResolved } from './config.mjs';

export function devServerPlugin(
	vitelyVueConfig: VitelyVueConfigResolved
): Plugin {
	return {
		name: 'vitely:vue-dev-server',
		configureServer(server) {
			if (!vitelyVueConfig.ssr) return undefined;
			return () => {
				server.middlewares.use(async (req, res, next) => {
					// Only process the index.html
					if (req.url !== '/index.html') {
						next();
						return;
					}

					const htmlFile = join(server.config.root, 'index.html');
					const html = await readFile(htmlFile, 'utf8');
					const serverRenderModule = join(
						fileURLToPath(import.meta.url),
						'../entry/ssr/server-render.mjs'
					);
					const { render } = await server.ssrLoadModule(
						serverRenderModule
					);
					const ssrContext = {};
					const { renderedHtml, status } = await render(
						req.originalUrl ?? '/',
						ssrContext
					);
					res.statusCode = status ?? 200;
					res.end(html.replace('<!-- ssr -->', renderedHtml));
				});
			};
		},
	};
}
