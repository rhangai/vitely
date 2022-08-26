import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import FastifyStatic from '@fastify/static';
import { fastify as Fastify } from 'fastify';
import { render, createHtmlRenderer } from './server-render.mjs';

async function main(clientDir: string) {
	const html = await readFile(resolve(clientDir, 'index.html'), 'utf8');
	const renderHtml = await createHtmlRenderer(html);

	const fastify = Fastify();
	await fastify.register(FastifyStatic, {
		root: resolve(clientDir, 'assets'),
		prefix: '/assets/',
	});
	fastify.get('*', async (req, res) => {
		try {
			const result = await render(req.url);
			await res
				.status(result.status ?? 200)
				.type('text/html')
				.send(renderHtml(result));
		} catch (e: any) {
			await res.status(500).send({});
		}
	});
	await fastify.listen({
		port: 3000,
	});
}

void main(process.argv[2]);
