import { buildRoutes } from '@vitely/core/router';
import { RouteConfig } from 'vue-router';

export function buildRoutesVueRouter(
	base: string,
	modulesMap: Record<string, () => any>
) {
	const replacePath = (key: string) => {
		if (key.charAt(0) === '[' && key.charAt(key.length - 1) === ']') {
			return `:${key.substring(1, key.length - 1)}`;
		}
		return key;
	};
	const toPath = (keysParam: string[], wildcard: boolean | undefined) => {
		const keys = keysParam.map(replacePath);
		if (wildcard) {
			const wildcardKeys = keys.concat('*');
			return `/${wildcardKeys.join('/')}`;
		}
		return keys.length === 0 ? '/' : `/${keys.join('/')}/`;
	};

	const replaceName = (key: string) => {
		if (key.charAt(0) === '[' && key.charAt(key.length - 1) === ']') {
			return key.substring(1, key.length - 1);
		}
		return key;
	};
	const toName = (keysParam: string[], wildcard: boolean | undefined) => {
		const keys = keysParam.map(replaceName);
		if (wildcard) {
			const wildcardKeys = keys.concat('*');
			return wildcardKeys.join('-');
		}
		return keys.length === 0 ? 'index' : keys.join('-');
	};
	const { routes } = buildRoutes(
		base,
		modulesMap,
		({ value, fullKey, relativeKey, isWildcard, status }): RouteConfig => ({
			path: toPath(relativeKey, isWildcard),
			meta: { status },
			name: toName(fullKey, isWildcard),
			component: modulesMap[value],
		})
	);
	return {
		routes,
	};
}
