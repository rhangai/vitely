import { Plugin, ResolvedConfig } from 'vite';

/**
 *
 */
type CreateVirtualModuleDefinition =
	| string
	| ((config: ResolvedConfig) => string | Promise<string>);
export type CreateVirtualModulesMap = {
	[key: string]: CreateVirtualModuleDefinition;
};
/**
 *
 */
export type CreateVirtualModulesPluginOptions = {
	name: string;
	modules?: CreateVirtualModulesMap;
};

/**
 * Create virtual modules
 */
export function createVirtualModulesPlugin(
	options: CreateVirtualModulesPluginOptions
): Plugin {
	const modulesMap = options.modules ?? {};

	const resolveIdMap: Record<string, string> = {};
	const loadMap: Record<string, string> = {};

	const configResolved = async (param: ResolvedConfig) => {
		if (!options.modules) return;
		// eslint-disable-next-line guard-for-in
		for (const key in modulesMap) {
			const moduleDefinition = modulesMap[key];
			const code =
				typeof moduleDefinition === 'string'
					? moduleDefinition
					: await moduleDefinition(param);
			const virtualId = `\0${key}`;
			resolveIdMap[key] = virtualId;
			loadMap[virtualId] = code;
		}
	};
	return {
		name: options.name,
		config() {
			const keys = Object.keys(modulesMap);
			if (keys.length <= 0) return undefined;
			return {
				optimizeDeps: {
					exclude: keys,
				},
			};
		},
		configResolved,
		resolveId(id: string) {
			return resolveIdMap[id];
		},
		load(id: string) {
			return loadMap[id];
		},
	};
}
