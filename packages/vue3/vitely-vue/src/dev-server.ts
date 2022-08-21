import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { default as middie } from '@fastify/middie';
import { VitelyCoreOptions } from '@vitely/core';
import { default as Fastify } from 'fastify';
import { ViteDevServer } from 'vite';

export async function createDevServer(
	vite: ViteDevServer,
	options: VitelyCoreOptions
) {
	const { root } = options;
	const fastify = Fastify();
	await fastify.register(middie);
	await fastify.use(vite.middlewares);
	fastify.get('/', async (req, res) => {
		try {
			const { render } = await vite.ssrLoadModule(
				'@vitely/vue-runtime/ssr-server/render'
			);
			let html = await readFile(resolve(root, 'index.html'), 'utf8');
			html = await vite.transformIndexHtml('/', html);
			const { renderedHtml } = await render(req.url);
			const ssrHtml = html.replace('<!-- vue-ssr -->', renderedHtml);
			await res.type('text/html').send(ssrHtml);
		} catch (e: any) {
			vite.ssrFixStacktrace(e);
			await res.status(500).send(e.stack);
		}
	});
	return {
		async listen() {
			await fastify.listen({
				port: 3000,
			});
		},
	};
}
