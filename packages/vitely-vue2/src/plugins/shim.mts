import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PluginOption } from 'vite';
import type { VitelyVueConfigResolved } from '../config.mjs';

export default function shimPlugin(
	config: VitelyVueConfigResolved
): PluginOption {
	let hasShim = false;
	const alias: Record<string, string> = {};

	if (config.shim.nuxt2) {
		hasShim = true;
		alias['@nuxtjs/composition-api'] = resolve(
			dirname(fileURLToPath(import.meta.url)),
			'../shim/nuxt2.mjs'
		);
	}
	if (!hasShim) return null;
	return {
		name: 'vitely:vue2-shim',
		config() {
			return {
				resolve: {
					alias,
				},
			};
		},
	};
}
