import type { Plugin as VitePlugin } from 'vite';
import { createVirtualModulesPlugin } from '../virtual-modules.mjs';
import type { VitelyCoreOptions } from './options.mjs';

/**
 * Generate the middleware module for ssr or
 */
function generateServerPlugin({ config }: VitelyCoreOptions) {
	const configServerSetup = config.server.setup;
	if (!configServerSetup) {
		return `export function serverSetup() {}`;
	}

	return `
	import { default as middie } from "@fastify/middie";
	import { default as serverSetupFn } from ${JSON.stringify(configServerSetup)};

	export async function serverSetup(fastify) {
		await fastify.register(middie);
		await serverSetupFn({
			middlewares: fastify,
		});
	}`;
}
/**
 * Generate the middleware module for ssr or
 */
function generateServerDevPlugin({ config }: VitelyCoreOptions) {
	const configServerSetup = config.server.setup;
	if (!configServerSetup) {
		return `export async function handle(req, res, next) {
			next();	
		}`;
	}

	return `
	import { default as connect } from 'connect';
	import { default as serverSetupFn } from ${JSON.stringify(configServerSetup)};

	let globalMiddlewares = null;

	async function loadMiddlewares() {
		const middlewares = connect();
		await serverSetupFn({ middlewares });
		return middlewares;
	}

	export function handle(req, res, next) {
		if (!globalMiddlewares) globalMiddlewares = loadMiddlewares();
		globalMiddlewares.then(middlewares => middlewares.handle(req, res, next));
	}
`;
}

/**
 * Plugin to setup the server
 */
export function serverPlugin(options: VitelyCoreOptions): VitePlugin {
	return {
		...createVirtualModulesPlugin({
			name: 'vitely:core-server',
			// prettier-ignore
			modules: {
				'virtual:vitely/core/server': () => generateServerPlugin(options),
				'virtual:vitely/core/server-dev': () => generateServerDevPlugin(options),
			},
		}),
		async configureServer(server) {
			const configServerSetup = options.config.server.setup;
			if (!configServerSetup) return;

			server.middlewares.use(async (req, res, next) => {
				const { handle } = await server.ssrLoadModule(
					'virtual:vitely/core/server-dev'
				);
				handle(req, res, next);
			});
		},
	};
}
