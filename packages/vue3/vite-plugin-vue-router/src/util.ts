export type VirtualModulesParam<T> = {
	[key: string]: string | ((param: T) => string);
};

export function createVirtualModules<T>(params: VirtualModulesParam<T>) {
	const resolveIdMap: Record<string, string> = {};
	const loadMap: Record<string, string> = {};
	const setup = (param: T) => {
		// eslint-disable-next-line guard-for-in
		for (const key in params) {
			const moduleParam = params[key];
			const code =
				typeof moduleParam === 'function'
					? moduleParam(param)
					: moduleParam;
			const virtualId = `\0${key}`;
			resolveIdMap[key] = virtualId;
			loadMap[virtualId] = code;
		}
	};
	return {
		setup,
		resolveId(id: string) {
			return resolveIdMap[id];
		},
		load(id: string) {
			return loadMap[id];
		},
	};
}
