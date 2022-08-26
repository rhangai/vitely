import { buildRoutes } from '@vitely/core/router';
import { RouteConfig } from 'vue-router';

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
		({
			value,
			relativeKey,
			isWildcard,
			status,
			children,
		}): RouteConfig => ({
			path: toPath(relativeKey, isWildcard),
			meta: { status },
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
