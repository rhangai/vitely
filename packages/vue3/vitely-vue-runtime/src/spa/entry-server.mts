import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import FastifyStatic from '@fastify/static';
import { fastify as Fastify } from 'fastify';

async function main(clientDir: string) {
	const fastify = Fastify();
	const html = await readFile(resolve(clientDir, 'index.html'), 'utf8');
	await fastify.register(FastifyStatic, {
		root: resolve(clientDir, 'assets'),
		prefix: '/assets/',
	});
	fastify.get('*', async (req, res) => {
		await res.type('text/html').send(html);
	});
	await fastify.listen({
		port: 3000,
	});
}

void main(process.argv[2]);
