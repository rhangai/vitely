import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import FastifyStatic from '@fastify/static';
import { default as Fastify } from 'fastify';
import { render } from 'virtual:vitely/core/render';
import { assertClientDir } from './arguments.mjs';
import { createHtmlSsrRender } from './html-ssr-render.mjs';

async function main(clientDir: string) {
	assertClientDir(clientDir);

	const inputHtml = await readFile(resolve(clientDir, 'index.html'), 'utf8');
	const renderHtml = await createHtmlSsrRender(inputHtml);

	const fastify = Fastify();
	await fastify.register(FastifyStatic, {
		root: resolve(clientDir, 'assets'),
		prefix: '/assets/',
	});
	fastify.get('*', async (req, res) => {
		try {
			const result = await render(req.url);
			const { html } = renderHtml(result.renderParams);
			await res
				.status(result.status ?? 200)
				.type('text/html')
				.send(html);
		} catch (e: any) {
			await res.status(500).send({});
		}
	});
	await fastify.listen({
		port: 3000,
	});
}

void main(process.argv[2]);