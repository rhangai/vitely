import { buildRoutes } from '@vitely/core/runtime';
import { RouteConfig } from 'vue-router';

export function buildRoutesVueRouter(
	base: string,
	modulesMap: Record<string, () => any>,
	pagesMode: 'nuxt2' | 'default'
) {
	const { replaceName, replacePath } =
		pagesMode === 'nuxt2' ? replacerNuxt2() : replacerDefault();
	const toPath = (keysParam: string[], wildcard: boolean | undefined) => {
		const keys = keysParam.map(replacePath);
		if (wildcard) {
			const wildcardKeys = keys.concat('*');
			return `/${wildcardKeys.join('/')}`;
		}
		return keys.length === 0 ? '/' : `/${keys.join('/')}/`;
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
		({ value, fullKey, isWildcard, status }): RouteConfig => ({
			path: toPath(fullKey, isWildcard),
			meta: { status },
			name: toName(fullKey, isWildcard),
			component: modulesMap[value],
		})
	);
	return {
		routes,
	};
}

function replacerNuxt2() {
	const replacePath = (key: string) => {
		if (key.charAt(0) === '_') {
			return `:${key.substring(1)}`;
		}
		return key;
	};
	const replaceName = (key: string) => {
		if (key.charAt(0) === '_') {
			return key.substring(1);
		}
		return key;
	};
	return {
		replaceName,
		replacePath,
	};
}

function replacerDefault() {
	const replacePath = (key: string) => {
		if (key.charAt(0) === '[' && key.charAt(key.length - 1) === ']') {
			return `:${key.substring(1, key.length - 1)}`;
		}
		return key;
	};
	const replaceName = (key: string) => {
		if (key.charAt(0) === '[' && key.charAt(key.length - 1) === ']') {
			return key.substring(1, key.length - 1);
		}
		return key;
	};
	return {
		replaceName,
		replacePath,
	};
}
