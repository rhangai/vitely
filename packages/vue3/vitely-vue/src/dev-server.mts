import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { default as middie } from '@fastify/middie';
import type { VitelyCoreConfigResolved } from '@vitely/core';
import { default as Fastify } from 'fastify';
import type { ViteDevServer } from 'vite';

export async function createDevServer(
	vite: ViteDevServer,
	config: VitelyCoreConfigResolved
) {
	const { root } = vite.config;
	const fastify = Fastify();
	await fastify.register(middie);
	await fastify.use(vite.middlewares);
	fastify.get('*', async (req, res) => {
		try {
			let html = await readFile(resolve(root, 'index.html'), 'utf8');
			html = await vite.transformIndexHtml('/', html);
			if (config.ssr) {
				const { render } = await vite.ssrLoadModule(
					'@vitely/vue-runtime/ssr/server-render'
				);
				const { renderedHtml } = await render(req.url);
				const ssrHtml = html.replace('<!-- vue-ssr -->', renderedHtml);
				await res.type('text/html').send(ssrHtml);
			} else {
				await res.type('text/html').send(html);
			}
		} catch (e: any) {
			vite.ssrFixStacktrace(e);
			await res.status(500).send(e.stack);
		}
	});
	return {
		async listen() {
			await fastify.listen({
				port: vite.config.server.port,
			});
		},
	};
}
