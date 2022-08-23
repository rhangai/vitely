import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { InlineConfig, Plugin } from 'vite';

export default function vitelyPluginVueCore(): Plugin {
	return {
		name: 'vitely:vue',
		config(c, configEnv) {
			const target = process.env.VITELY_TARGET || 'client';
			const isServer = target === 'server';
			const outDir = c.build?.outDir ?? 'dist';

			const resolve: InlineConfig['resolve'] = {
				alias: {
					'virtual:vitely/vue/app.vue': '/app.vue',
					'@vitely/vue/entry': '@vitely/vue/entry/ssr/client',
				},
			};

			if (configEnv.command === 'serve') {
				return { resolve };
			}

			if (isServer) {
				return {
					build: {
						ssr: true,
						outDir: join(outDir, 'server'),
						target: 'node16',
						rollupOptions: {
							input: {
								index: join(
									fileURLToPath(import.meta.url),
									'../entry/ssr/server.mjs'
								),
							},
						},
					},
					resolve,
					ssr: {
						noExternal: [/^(?!node:)/],
					},
				};
			}

			return {
				build: {
					ssr: false,
					outDir: join(outDir, 'client'),
				},
				resolve,
			};
		},
	};
}
