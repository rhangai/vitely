import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { InlineConfig, Plugin } from 'vite';
import type { VitelyCoreOptions } from './options.mjs';

export function buildPlugin({ config, alias, env }: VitelyCoreOptions): Plugin {
	return {
		name: 'vitely:core',
		config(c, configEnv) {
			const outDir = c.build?.outDir ?? 'dist';

			const define: InlineConfig['define'] = {};
			if (env) {
				Object.entries(env).forEach(([key, value]) => {
					define[`process.env.${key}`] = JSON.stringify(value);
				});
			}

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
					...alias,
				},
			};

			if (configEnv.command === 'serve') {
				return {
					define,
					resolve,
					ssr,
				};
			}

			// Build options
			const target = buildGetTarget();
			const isServer = target === 'server';
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
					define,
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
				define,
				resolve,
				ssr,
			};
		},
		transformIndexHtml: {
			enforce: 'pre',
			transform(html) {
				if (!config.injectEntry) return undefined;
				return {
					html,
					tags: [
						{
							tag: 'script',
							attrs: { type: 'module' },
							injectTo: 'body',
							children: `import 'virtual:vitely/core/entry';`,
						},
					],
				};
			},
		},
	};
}

/**
 *
 * @returns
 */
function buildGetTarget() {
	const target = process.env.VITELY_TARGET;
	if (!target) return null;
	if (target.toLowerCase() === 'server') return 'server';
	if (target.toLowerCase() === 'client') return 'client';
	throw new Error(
		`Invalid VITELY_TARGET "${target}". Must be empty, client or server`
	);
}
