import type { PluginOption } from 'vite';
import { buildPlugin } from './build.mjs';
import {
	resolveCoreConfig,
	VitelyCoreConfig,
	VitelyCoreConfigResolved,
} from './config.mjs';
import { devServerPlugin } from './dev-server.mjs';
import { middlewaresPlugin } from './middlewares.mjs';
import type { VitelyCoreOptions } from './options.mjs';
import { pluginsPlugin } from './plugins.mjs';

export { VitelyCoreConfig, VitelyCoreConfigResolved, resolveCoreConfig };

export function corePlugin(options: VitelyCoreOptions): PluginOption {
	return [
		//
		buildPlugin(options),
		devServerPlugin(options),
		middlewaresPlugin(options),
		pluginsPlugin(options),
	];
}
