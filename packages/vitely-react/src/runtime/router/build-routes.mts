import { buildRoutes } from '@vitely/core/runtime';
import { ComponentType, lazy } from 'react';

export type RouteInfo = {
	path: string;
	index: boolean;
	Element: ComponentType;
};

export function buildRoutesReactRouter(
	base: string,
	modulesMap: Record<string, () => any>
) {
	const replaceParams = (param: string) => {
		const match =
			param.charAt(0) === '[' && param.charAt(param.length - 1) === ']';
		if (match) {
			return `:${param.substring(1, param.length - 1)}`;
		}
		return param;
	};
	const toPath = (keysParam: string[], wildcard: boolean | undefined) => {
		const keys = keysParam.map(replaceParams);
		if (wildcard) {
			const wildcardKeys = keys.concat(':path');
			return `/${wildcardKeys.join('/')}`;
		}
		return keys.length === 0 ? '/' : `/${keys.join('/')}/`;
	};
	const { routes } = buildRoutes(
		base,
		modulesMap,
		({ value, fullKey, isWildcard }): RouteInfo => ({
			path: toPath(fullKey, isWildcard),
			index: fullKey.length === 0,
			Element: lazy(modulesMap[value]),
		})
	);
	return {
		routes,
	};
}
