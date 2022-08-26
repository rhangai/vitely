import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import FastifyStatic from '@fastify/static';
import { fastify as Fastify } from 'fastify';
import { render } from './server-render.mjs';

type RenderResult = Awaited<ReturnType<typeof render>>;

async function createHtmlRenderer(clientDir: string) {
	const html = await readFile(resolve(clientDir, 'index.html'), 'utf8');
	return ({ renderedHtml }: RenderResult) => {
		const ssrHtml = html.replace('<!-- ssr -->', renderedHtml);
		return ssrHtml;
	};
}

async function main(clientDir: string) {
	const renderHtml = await createHtmlRenderer(clientDir);

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
