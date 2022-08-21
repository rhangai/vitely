import { resolve } from 'node:path';
import pluginVue from '@vitejs/plugin-vue';
import type { VitelyPlugin, VitelyPluginContext } from '@vitely/core';
import { createDevServer } from './dev-server';

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
				viteConfig.resolve = {
					alias: {
						'virtual:@vitely/app': resolve(options.root, 'app.vue'),
					},
				};
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
						minify: 'esbuild',
						target: 'node16',
						rollupOptions: {
							input: {
								index: '@vitely/vue-runtime/ssr-server/entry',
							},
						},
					},
					ssr: {
						format: 'cjs',
					},
				});
			});
			hooks.dev.tapPromise('@vitely/vue', async ({ vite, options }) => {
				const devServer = await createDevServer(vite, options);
				return async () => {
					await devServer.listen();
				};
			});
		},
	};
}
