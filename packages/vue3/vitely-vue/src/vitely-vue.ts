import { resolve } from 'node:path';
import { default as pluginVue } from '@vitejs/plugin-vue';
import type { VitelyPlugin, VitelyPluginContext } from '@vitely/core';
import { createDevServer } from './dev-server.js';

export function vitelyPlugin(): VitelyPlugin {
	return {
		install({ hooks }: VitelyPluginContext) {
			hooks.config.tapPromise('@vitely/vue', async (context) => {
				const { default: pluginVueRouter } = await import(
					// @ts-ignore
					'@vitely/vite-plugin-vue-router'
				);
				const { viteConfig, options } = context;
				viteConfig.configFile = false;
				viteConfig.plugins.push(pluginVue());
				viteConfig.plugins.push(pluginVueRouter());
				viteConfig.appType = 'custom';
				// viteConfig.server.middlewareMode = true;
				viteConfig.build.outDir = resolve(options.root, '../dist');
				viteConfig.resolve = {
					alias: {
						'virtual:@vitely/vue-runtime/app': resolve(
							options.root,
							'app.vue'
						),
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
						target: 'node16',
						rollupOptions: {
							input: {
								index: '@vitely/vue-runtime/ssr-server',
							},
							plugins: [],
						},
						commonjsOptions: {
							include: [/./],
							transformMixedEsModules: true,
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
