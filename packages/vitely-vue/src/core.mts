import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { InlineConfig, Plugin } from 'vite';
import { VitelyVueConfigResolved } from './config.mjs';

export default function vitelyPluginVueCore(
	vitelyVueConfig: VitelyVueConfigResolved
): Plugin {
	return {
		name: 'vitely:vue',
		config(c, configEnv) {
			const target = process.env.VITELY_TARGET || 'client';
			const isServer = target === 'server';
			const outDir = c.build?.outDir ?? 'dist';

			const resolve: InlineConfig['resolve'] = {
				alias: {
					'virtual:vitely/vue/app.vue': '/app.vue',
					'@vitely/vue/entry': vitelyVueConfig.ssr
						? '@vitely/vue/entry/ssr/client'
						: '@vitely/vue/entry/spa/client',
				},
			};

			if (configEnv.command === 'serve') {
				return { resolve };
			}

			if (isServer) {
				const serverEntry = vitelyVueConfig.ssr
					? 'entry/ssr/server'
					: 'entry/spa/server';

				return {
					build: {
						ssr: true,
						outDir: join(outDir, 'server'),
						target: 'node16',
						rollupOptions: {
							input: {
								index: join(
									dirname(fileURLToPath(import.meta.url)),
									serverEntry
								),
							},
						},
					},
					resolve,
					ssr: vitelyVueConfig.standaloneServer
						? {
								noExternal: [/^(?!node:)/],
						  }
						: {},
				};
			}

			return {
				build: {
					ssr: false,
					ssrManifest: vitelyVueConfig.ssr,
					outDir: join(outDir, 'client'),
				},
				resolve,
			};
		},
	};
}
