import { resolve, join } from 'node:path';
// @ts-ignore
import { default as pluginNodeResolve } from '@rollup/plugin-node-resolve';
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
				const { viteConfig, config } = context;
				viteConfig.plugins.push(pluginVue());
				viteConfig.plugins.push(pluginVueRouter());
				viteConfig.appType = 'custom';
				viteConfig.server.middlewareMode = true;
				viteConfig.resolve = {
					alias: {
						'virtual:@vitely/vue-runtime/app': '/app.vue',
						'@vitely/vue-runtime/entry': config.ssr
							? '@vitely/vue-runtime/ssr/entry-client'
							: '@vitely/vue-runtime/spa/entry-client',
					},
				};
			});
			hooks.build.tap('@vitely/vue', (context) => {
				const { viteConfig, config, addViteConfig } = context;

				viteConfig.build.outDir = join(config.outDir, 'client');
				addViteConfig({
					...viteConfig,
					build: {
						...viteConfig.build,
						outDir: join(config.outDir, 'server'),
						ssr: true,
						target: 'node16',
						rollupOptions: {
							input: {
								index: config.ssr
									? '@vitely/vue-runtime/ssr/entry-server'
									: '@vitely/vue-runtime/spa/entry-server',
							},
							// - plugins: [pluginNodeResolve()],
						},
					},
					ssr: {
						noExternal: [/^(?!node:)/],
					},
				});
			});
			hooks.dev.tapPromise('@vitely/vue', async ({ vite, config }) => {
				const devServer = await createDevServer(vite, config);
				return async () => {
					await devServer.listen();
				};
			});
		},
	};
}
