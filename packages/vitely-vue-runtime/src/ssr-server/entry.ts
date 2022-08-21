import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { render } from '@vitely/vue-runtime/ssr-server';
import Fastify from 'fastify';

async function main() {
	const fastify = Fastify();
	fastify.get('/', async (req, res) => {
		try {
			const html = await readFile(
				resolve('./dist/client/index.html'),
				'utf8'
			);
			const { renderedHtml } = await render(req.url);
			const ssrHtml = html.replace('<!-- vue-ssr -->', renderedHtml);
			await res.type('text/html').send(ssrHtml);
		} catch (e: any) {
			await res.status(500).send({});
		}
	});
	await fastify.listen({
		port: 3000,
	});
}

void main();
