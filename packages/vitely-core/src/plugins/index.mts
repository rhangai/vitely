import type { PluginOption } from 'vite';
import { buildPlugin } from './build.mjs';
import {
	resolveConfigCore,
	VitelyConfig,
	VitelyConfigResolved,
} from './config.mjs';
import { devServerPlugin } from './dev-server.mjs';
import { middlewaresPlugin } from './middlewares.mjs';
import { pluginsPlugin } from './plugins.mjs';

export type { VitelyConfig, VitelyConfigResolved };
export { resolveConfigCore };

export function corePlugin(config: VitelyConfigResolved): PluginOption {
	return [
		//
		buildPlugin(config),
		devServerPlugin(config),
		middlewaresPlugin(config),
		pluginsPlugin(config),
	];
}
