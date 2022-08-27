import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Plugin } from 'vite';
import {
	createHtmlSsrRender,
	HtmlSsrRenderParams,
} from '../server/html-ssr-render.mjs';

export type VitelyConfigDevServerRenderResult = {
	redirect: string | null;
	status?: number | undefined;
	renderParams: HtmlSsrRenderParams;
};

export type VitelyConfigDevServer = {
	ssr: boolean;
	renderModule: string;
};

export function devServerPlugin(config: VitelyConfigDevServer): Plugin {
	return {
		name: 'vitely:core-dev-server',
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
					const renderHtml = await createHtmlSsrRender(inputHtml);

					const { render } = await server.ssrLoadModule(
						config.renderModule
					);
					const result = await render(req.originalUrl ?? '/');
					if (result.redirect) {
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
