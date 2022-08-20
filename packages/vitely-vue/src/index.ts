import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import middie from '@fastify/middie';
import pluginVue from '@vitejs/plugin-vue';
import fastify from 'fastify';
import { createServer } from 'vite';

async function main() {
	const vite = await createServer({
		root: '/home/rhangai/Projects/personal/vitefy/demo',
		configFile: false,
		appType: 'custom',
		server: {
			middlewareMode: true,
		},
		plugins: [pluginVue()],
	});

	const app = fastify();
	await app.register(middie);
	await app.use(vite.middlewares);

	app.get('/', async (req, res) => {
		try {
			const html = await readFile(
				'/home/rhangai/Projects/personal/vitefy/demo/index.html',
				'utf8'
			);
			console.log(
				resolve(dirname(fileURLToPath(import.meta.url)), './runtime')
			);

			const { default: component } = await vite.ssrLoadModule(
				'/home/rhangai/Projects/personal/vitefy/demo/app.vue'
			);
			console.log(component);

			const { render } = await vite.ssrLoadModule(
				resolve(dirname(fileURLToPath(import.meta.url)), './runtime')
			);
			const newHtml = await vite.transformIndexHtml('/', html);
			const ssr = await render({ component });
			await res
				.type('text/html')
				.send(newHtml.replace('<!-- vue-ssr -->', ssr));
		} catch (e: any) {
			vite.ssrFixStacktrace(e);
			await res.status(500).send(e.stack);
		}
	});
	console.log(import.meta.url);
	await app.listen({
		port: 3000,
	});
}

void main();
