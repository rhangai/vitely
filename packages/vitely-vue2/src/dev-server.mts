import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import type { Plugin } from 'vite';
import { VitelyVueConfigResolved } from './config.mjs';

type ServerRenderModule = typeof import('./entry/ssr/server-render.mjs');

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
					const { render, createHtmlRenderer } =
						(await server.ssrLoadModule(
							serverRenderModule
						)) as ServerRenderModule;
					const renderHtml = await createHtmlRenderer(html);
					const result = await render(req.originalUrl ?? '/');
					if (result.redirect) {
						res.writeHead(302, {
							location: result.redirect,
						});
						res.end();
						return;
					}

					res.statusCode = result.status ?? 200;
					res.end(renderHtml(result));
				});
			};
		},
	};
}
