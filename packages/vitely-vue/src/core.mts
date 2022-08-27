import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { vitelyGetTarget } from '@vitely/core';
import { InlineConfig, Plugin } from 'vite';
import { VitelyVueConfigResolved } from './config.mjs';

export default function vitelyPluginVueCore(
	vitelyVueConfig: VitelyVueConfigResolved
): Plugin {
	return {
		name: 'vitely:vue',
		config(c, configEnv) {
			const target = vitelyGetTarget();

			const isServer = target === 'server';
			const outDir = c.build?.outDir ?? 'dist';

			const ssr: InlineConfig['ssr'] = {
				noExternal: [/^@vitely/],
			};
			const resolve: InlineConfig['resolve'] = {
				alias: {
					'virtual:vitely/vue/app.vue': '/app.vue',
					'@vitely/vue/entry': vitelyVueConfig.ssr
						? '@vitely/vue/entry/ssr/client'
						: '@vitely/vue/entry/spa/client',
				},
			};

			if (configEnv.command === 'serve') {
				return {
					resolve,
					ssr,
				};
			}

			if (vitelyVueConfig.ssr && !target) {
				throw new Error(
					`\n=========\nError when building with ssr enabled.\n\nYou must set VITELY_TARGET to server or client\n=========\n`
				);
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
								...ssr,
								noExternal: [/^(?!node:)/],
						  }
						: ssr,
				};
			}

			return {
				build: {
					ssr: false,
					ssrManifest: vitelyVueConfig.ssr,
					outDir: target ? join(outDir, 'client') : outDir,
				},
				ssr,
				resolve,
			};
		},
	};
}
