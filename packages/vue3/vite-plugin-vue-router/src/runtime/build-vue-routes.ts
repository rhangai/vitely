import { buildRoutes } from '@vitely/core-runtime/dist/router';
import { RouteRecordRaw } from 'vue-router';

export function buildRoutesVueRouter(
	base: string,
	modulesMap: Record<string, () => any>
) {
	const toPath = (keys: string[], wildcard: boolean | undefined) => {
		if (wildcard) {
			const wildcardKeys = keys.concat(':path(.*)');
			return `/${wildcardKeys.join('/')}`;
		}
		return keys.length === 0 ? '/' : `/${keys.join('/')}/`;
	};
	const toName = (keys: string[]) => {
		return keys.length === 0 ? 'index' : keys.join('-');
	};
	const { routes } = buildRoutes(
		base,
		modulesMap,
		({ value, relativeKey, isWildcard, children }): RouteRecordRaw => ({
			path: toPath(relativeKey, isWildcard),
			meta: isWildcard ? { status: 404 } : undefined,
			name:
				value && !isWildcard && !children
					? toName(relativeKey)
					: undefined,
			component: modulesMap[value],
		})
	);
	return {
		routes,
	};
}
