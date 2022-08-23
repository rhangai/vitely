import { Plugin, ResolvedConfig } from 'vite';

/**
 *
 */
export type CreateVirtualModulesMap = {
	[key: string]: string;
};
/**
 *
 */
export type CreateVirtualModulesPluginOptions = {
	name: string;
	modules?: (
		viteConfig: ResolvedConfig
	) => CreateVirtualModulesMap | Promise<CreateVirtualModulesMap>;
};

/**
 * Create virtual modules
 */
export function createVirtualModulesPlugin(
	options: CreateVirtualModulesPluginOptions
): Plugin {
	const resolveIdMap: Record<string, string> = {};
	const loadMap: Record<string, string> = {};
	const configResolved = async (param: ResolvedConfig) => {
		if (!options.modules) return;
		const modulesMap = await options.modules(param);
		// eslint-disable-next-line guard-for-in
		for (const key in modulesMap) {
			const moduleDefinition = modulesMap[key];
			const virtualId = `\0${key}`;
			resolveIdMap[key] = virtualId;
			loadMap[virtualId] = moduleDefinition;
		}
	};
	return {
		name: options.name,
		configResolved,
		resolveId(id: string) {
			return resolveIdMap[id];
		},
		load(id: string) {
			return loadMap[id];
		},
	};
}
