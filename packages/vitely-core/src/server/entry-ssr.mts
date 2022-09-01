import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import FastifyStatic from '@fastify/static';
import { default as Fastify } from 'fastify';
import { render } from 'virtual:vitely/core/render';
import { serverSetup } from 'virtual:vitely/core/server';
import { serializeValue } from '../serialize-value.mjs';
import { parseArguments } from './arguments.mjs';
import { createHtmlSsrRender } from './html-ssr-render.mjs';

async function main() {
	const { clientDir, port, host } = parseArguments(process.argv.slice(2));

	const fastify = Fastify({
		logger: true,
	});
	process.on('uncaughtException', (error) => {
		fastify.log.error(error);
	});
	process.on('unhandledRejection', (error) => {
		fastify.log.error(error);
	});
	await serverSetup(fastify);

	const inputHtml = await readFile(resolve(clientDir, 'index.html'), 'utf8');
	const renderHtml = await createHtmlSsrRender(inputHtml);

	await fastify.register(FastifyStatic, {
		root: resolve(clientDir, 'assets'),
		prefix: '/assets/',
	});
	fastify.get('*', async (req, res) => {
		try {
			const result = await render(req.url, {
				logger: req.log,
			});

			if ('redirect' in result) {
				await res.redirect(result.status ?? 302, result.redirect);
				return;
			}

			const serialized = serializeValue({
				context: result.context,
			});
			const { html } = renderHtml({
				...result.renderParams,
				body: ([] as Array<string | null | undefined>)
					.concat(result.renderParams.body)
					.concat(`<script>window.__VITELY__=${serialized}</script>`),
			});
			await res
				.status(result.status ?? 200)
				.type('text/html')
				.send(html);
		} catch (e: any) {
			req.log.error(e);
			await res.status(500).send({});
		}
	});
	await fastify.listen({
		port,
		host,
	});
}

void main();
