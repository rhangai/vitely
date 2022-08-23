import { join } from 'node:path';
import { default as pluginVue } from '@vitejs/plugin-vue';
import type { VitelyModule, VitelyContext } from '@vitely/core';
import { default as pluginVueRouter } from '@vitely/vite-plugin-vue-router';
import { createDevServer } from '../dev-server.mjs';

export function vitelyVueModule(): VitelyModule {
	return {
		install({ hooks }: VitelyContext) {
			hooks.config.tapPromise('@vitely/vue', async (context) => {
				const { viteConfig, config } = context;
				viteConfig.plugins.push(pluginVue());
				viteConfig.plugins.push(pluginVueRouter());
				viteConfig.appType = 'custom';
				viteConfig.server.middlewareMode = true;
				viteConfig.resolve = {
					alias: {
						'virtual:vitely/vue/app.vue': join(
							config.root,
							'/app.vue'
						),
						'@vitely/vue/runtime/entry': config.ssr
							? '@vitely/vue/runtime/ssr/client'
							: '@vitely/vue/runtime/spa/client',
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
									? '@vitely/vue/runtime/ssr/server'
									: '@vitely/vue/runtime/spa/server',
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
