import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { default as vitePluginReact } from '@vitejs/plugin-react';
import {
	corePlugin,
	devServerPlugin,
	pluginsPlugin,
	middlewaresPlugin,
} from '@vitely/core/plugins';
import { PluginOption } from 'vite';
import { resolveConfig, VitelyReactConfig } from './config.mjs';
import './types.mjs';

/**
 * Main entrypoint
 * @param configParam
 * @returns A vite plugin object (Or plugins :O)
 */
export default function vitelyPluginVue(
	configParam?: VitelyReactConfig
): PluginOption {
	const config = resolveConfig(configParam);
	return [
		// Plugins
		vitePluginReact(),
		devServerPlugin({
			ssr: config.ssr,
		}),
		corePlugin({
			moduleBase: dirname(fileURLToPath(import.meta.url)),
			ssr: config.ssr,
			standaloneServer: config.standaloneServer,
			alias: {
				'virtual:vitely/react/app.tsx': '/app.tsx',
			},
		}),
		pluginsPlugin(config.plugins),
		middlewaresPlugin(config.middlewares),
	];
}
