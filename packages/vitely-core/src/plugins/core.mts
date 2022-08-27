import { join } from 'node:path';
import { InlineConfig, Plugin } from 'vite';
import { vitelyGetTarget } from '../target.mjs';

export type VitelyConfigCore = {
	ssr: boolean;
	standaloneServer: boolean;
	base: string;
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
					[`${config.base}/entry`]: config.ssr
						? `${config.base}/entry/ssr/client`
						: `${config.base}/entry/spa/client`,
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
					? `${config.base}/entry/ssr/server`
					: `${config.base}/entry/spa/server`;

				return {
					build: {
						ssr: true,
						outDir: join(outDir, 'server'),
						target: 'node16',
						rollupOptions: {
							input: {
								index: serverEntry,
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
