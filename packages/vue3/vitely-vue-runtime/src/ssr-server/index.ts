import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import FastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import { render } from './render.js';

async function main(clientDir: string) {
	const fastify = Fastify();

	const html = await readFile(resolve(clientDir, 'index.html'), 'utf8');
	await fastify.register(FastifyStatic, {
		root: resolve(clientDir, 'assets'),
		prefix: '/assets/',
	});
	fastify.get('/', async (req, res) => {
		try {
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

void main(process.argv[2]);
