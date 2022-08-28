import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { default as FastifyStatic } from '@fastify/static';
import { default as Fastify } from 'fastify';
import { parseArguments } from './arguments.mjs';

async function main() {
	const { clientDir, port, host } = parseArguments(process.argv.slice(2));

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
		port,
		host,
	});
}

void main();
