import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Plugin } from 'vite';
import { createHtmlSsrRender } from '../server/html-ssr-render.mjs';
import { VitelyLogger } from '../types.mjs';
import type { VitelyCoreOptions } from './options.mjs';

type RenderModule = typeof import('virtual:vitely/core/render');

export function devServerPlugin({ config }: VitelyCoreOptions): Plugin {
	let logger: VitelyLogger;
	return {
		name: 'vitely:core-dev-server',
		configResolved(resolved) {
			logger = {
				warn(something) {
					resolved.logger.warn(something);
				},
				error(something) {
					resolved.logger.error(something);
				},
				info(something) {
					resolved.logger.info(something);
				},
			};
		},
		configureServer(server) {
			if (!config.ssr) return undefined;
			return () => {
				server.middlewares.use(async (req, res, next) => {
					// Only process the index.html
					if (req.url !== '/index.html') {
						next();
						return;
					}

					const inputHtmlFile = join(
						server.config.root,
						'index.html'
					);
					const inputHtml = await readFile(inputHtmlFile, 'utf8');
					const transformedHtml = await server.transformIndexHtml(
						req.originalUrl ?? '/',
						inputHtml
					);
					const renderHtml = await createHtmlSsrRender(
						transformedHtml
					);

					const { render } = (await server.ssrLoadModule(
						'virtual:vitely/core/render'
					)) as RenderModule;
					const result = await render(req.originalUrl ?? '/', {
						logger,
					});
					if ('redirect' in result) {
						res.writeHead(302, {
							location: result.redirect,
						});
						res.end();
						return;
					}
					const { html } = renderHtml(result.renderParams);
					res.statusCode = result.status ?? 200;
					res.end(html);
				});
			};
		},
	};
}
