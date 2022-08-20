import { Plugin } from 'vite';
import { VitelyContext } from '../context';

const NULL_CHAR = '\0';

export type ModuleMap = Record<string, string>;

export function createVirtualModules(
	modulesMapFunction: (context: VitelyContext) => Record<string, string>
): Pick<Plugin, 'load' | 'resolveId'> & {
	setup(context: VitelyContext): void;
} {
	let modulesMap: Record<string, string>;
	return {
		setup(context: VitelyContext) {
			modulesMap = modulesMapFunction(context);
		},
		resolveId(id) {
			const moduleId = id.charAt(0) === '/' ? id.substring(1) : id;
			if (modulesMap[moduleId] != null) {
				return NULL_CHAR + moduleId;
			}
		},
		load(id) {
			if (id.charAt(0) === NULL_CHAR) {
				const moduleId = id.substring(1);
				if (modulesMap[moduleId]) {
					return modulesMap[moduleId];
				}
			}
		},
	};
}
