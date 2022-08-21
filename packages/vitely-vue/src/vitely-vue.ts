import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import middie from '@fastify/middie';
import pluginVue from '@vitejs/plugin-vue';
import type { VitelyPlugin, VitelyPluginContext } from '@vitely/core';
import fastify from 'fastify';

export function vitelyPlugin(): VitelyPlugin {
	return {
		install({ hooks }: VitelyPluginContext) {
			hooks.config.tap('@vitely/vue', (context) => {
				const { viteConfig, options } = context;
				viteConfig.configFile = false;
				viteConfig.plugins.push(pluginVue());
				viteConfig.appType = 'custom';
				viteConfig.server.middlewareMode = true;
				viteConfig.build.outDir = resolve(options.root, '../dist');
			});
			hooks.build.tap('@vitely/vue', (context) => {
				const { viteConfig, options, addViteConfig } = context;
				viteConfig.build.outDir = resolve(
					options.root,
					'../dist/client'
				);
				addViteConfig({
					...viteConfig,
					build: {
						...viteConfig.build,
						outDir: resolve(options.root, '../dist/server'),
						ssr: true,
						rollupOptions: {
							input: {
								index: '@vitely/vue-runtime/ssr-server',
							},
						},
					},
				});
			});
			hooks.dev.tapPromise('@vitely/vue', async ({ vite, options }) => {
				const { root } = options;
				const app = fastify();
				await app.register(middie);
				await app.use(vite.middlewares);
				app.get('/', async (req, res) => {
					try {
						const html = await readFile(
							resolve(root, 'index.html'),
							'utf8'
						);

						const { default: component } = await vite.ssrLoadModule(
							resolve(root, 'app.vue')
						);

						const { render } = await vite.ssrLoadModule(
							'@vitely/vue-runtime/ssr'
						);
						const newHtml = await vite.transformIndexHtml(
							'/',
							html
						);
						const ssr = await render({ component });

						const nossrHtml = newHtml.replace(
							'<!-- vue-ssr -->',
							''
						);
						const ssrHtml = newHtml.replace(
							'<!-- vue-ssr -->',
							ssr
						);

						await res.type('text/html').send(ssrHtml);
					} catch (e: any) {
						vite.ssrFixStacktrace(e);
						await res.status(500).send(e.stack);
					}
				});

				return async () => {
					await app.listen({
						port: 3000,
					});
				};
			});
		},
	};
}
