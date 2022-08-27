import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { InlineConfig, Plugin } from 'vite';
import { vitelyGetTarget } from '../target.mjs';

export type VitelyConfigCore = {
	moduleBase: string;
	ssr: boolean;
	standaloneServer: boolean;
	alias: Record<string, string>;
};

export function corePlugin(config: VitelyConfigCore): Plugin {
	return {
		name: 'vitely:core',
		config(c, configEnv) {
			const target = vitelyGetTarget();

			const isServer = target === 'server';
			const outDir = c.build?.outDir ?? 'dist';

			const ssr: InlineConfig['ssr'] = {
				noExternal: [/^@vitely/],
			};
			const resolve: InlineConfig['resolve'] = {
				alias: {
					'virtual:vitely/core/entry': config.ssr
						? join(config.moduleBase, 'entry/client-ssr.mjs')
						: join(config.moduleBase, 'entry/client-spa.mjs'),
					'virtual:vitely/core/render': join(
						config.moduleBase,
						'entry/server-render.mjs'
					),
					...config.alias,
				},
			};

			if (configEnv.command === 'serve') {
				return {
					resolve,
					ssr,
				};
			}

			if (config.ssr && !target) {
				throw new Error(
					`\n=========\nError when building with ssr enabled.\n\nYou must set VITELY_TARGET to server or client\n=========\n`
				);
			}

			if (isServer) {
				const serverEntry = config.ssr
					? `../server/entry-ssr.mjs`
					: `../server/entry-spa.mjs`;

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
					ssr: config.standaloneServer
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
					ssrManifest: config.ssr,
					outDir: target ? join(outDir, 'client') : outDir,
				},
				ssr,
				resolve,
			};
		},
	};
}
