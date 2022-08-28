import type { PluginOption } from 'vite';
import { buildPlugin } from './build.mjs';
import {
	resolveCoreConfig,
	VitelyCoreConfig,
	VitelyCoreConfigResolved,
} from './config.mjs';
import { devServerPlugin } from './dev-server.mjs';
import { middlewaresPlugin } from './middlewares.mjs';
import { pluginsPlugin } from './plugins.mjs';

export type { VitelyCoreConfig, VitelyCoreConfigResolved };
export { resolveCoreConfig };

export function corePlugin(config: VitelyCoreConfigResolved): PluginOption {
	return [
		//
		buildPlugin(config),
		devServerPlugin(config),
		middlewaresPlugin(config),
		pluginsPlugin(config),
	];
}
