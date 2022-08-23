import { RouteItem, RouteTree } from './route-tree.mjs';

type RouteMappedItem<T> = T & {
	children?: Array<RouteMappedItem<T>>;
};

type BuildRoutesResult<T> = {
	routes: Array<RouteMappedItem<T>>;
	originalRoutes: RouteItem[];
};

export function buildRoutes<T>(
	base: string,
	modulesMap: Record<string, () => any>,
	mapper: (item: RouteItem) => T
): BuildRoutesResult<T> {
	const tree = new RouteTree();
	// eslint-disable-next-line guard-for-in
	for (const path in modulesMap) {
		tree.add(path.substring(base.length), path);
	}

	const originalRoutes = tree.build();
	const mapItem = (item: RouteItem): RouteMappedItem<T> => {
		const value = mapper(item);
		if (item.children) {
			return {
				...value,
				children: item.children.map(mapItem),
			};
		}
		return value;
	};
	const routes = originalRoutes.map(mapItem);
	return { routes, originalRoutes };
}
