type RouteTreePage = {
	value: string;
};

/**
 * Internal route tree item
 */
type RouteTreeItem = {
	key: string;
	page?: RouteTreePage;
	wildcard?: RouteTreePage;
	indexPage?: RouteTreePage;
	children?: Record<string, RouteTreeItem>;
	dynamicChildren?: Record<string, RouteTreeItem>;
};

/**
 * Item for the route built
 */
export type RouteItem = {
	value: string;
	isIndex?: boolean;
	isWildcard?: boolean;
	relativeKey: string[];
	fullKey: string[];
	children?: RouteItem[];
};

/**
 * Route tree
 *
 * Helper class to build the route array from a list of files
 *
 * Usage
 *
 * const tree = new RouteTree();
 * tree.add('route', 'value');
 * ...
 * const routes = tree.build();
 */
export class RouteTree {
	private root: RouteTreeItem = { key: '' };

	/**
	 * Get a child item according to the route key
	 * @returns The child item
	 */
	private getItem(parentParam: RouteTreeItem, key: string): RouteTreeItem {
		let children;
		const parent = parentParam;
		if (key.charAt(0) === ':') {
			children = parent.dynamicChildren;
			if (!children) {
				// eslint-disable-next-line no-multi-assign
				children = parent.dynamicChildren = {};
			}
		} else {
			children = parent.children;
			if (!children) {
				// eslint-disable-next-line no-multi-assign
				children = parent.children = {};
			}
		}
		let item = children[key];
		if (!item) {
			item = { key };
			children[key] = item;
		}
		return item;
	}

	/**
	 * Parse the page key
	 * @returns pageName: Name of the page
	 * @returns pageExt: Page extension
	 */
	private parsePage(page: string) {
		const extIndex = page.lastIndexOf('.');
		if (extIndex < 0) {
			return { pageName: page, pageExt: '' };
		}
		const pageExt = page.substring(extIndex);
		const basename = page.substring(0, extIndex);
		return { pageName: basename, pageExt };
	}

	/**
	 * Add a new root with a new value
	 */
	add(path: string, value: string) {
		let item = this.root;
		const keys = path.split('/');
		for (let i = 0, max = keys.length - 1; i < max; ++i) {
			item = this.getItem(item, keys[i]);
		}
		const routeKey = keys[keys.length - 1];
		const { pageName } = this.parsePage(routeKey);
		if (pageName === '[404]') {
			item.wildcard = { value };
		} else if (pageName !== 'index') {
			item = this.getItem(item, pageName);
			item.page = { value };
		} else {
			item.indexPage = { value };
		}
	}

	/**
	 * Build the list from the tree
	 */
	private buildChildren(
		result: RouteItem[],
		parentKey: string[],
		parentFullKey: string[],
		item: RouteTreeItem
	) {
		// Push the index page
		if (item.indexPage) {
			result.push({
				relativeKey: parentKey,
				fullKey: parentFullKey,
				value: item.indexPage.value,
				isIndex: true,
			});
		}
		if (item.children) {
			const keys = Object.keys(item.children).sort();
			keys.forEach((key) => {
				this.buildItem(
					result,
					parentKey.concat(key),
					parentFullKey.concat(key),
					item.children![key]
				);
			});
		}
		if (item.dynamicChildren) {
			const keys = Object.keys(item.dynamicChildren).sort();
			keys.forEach((key) => {
				this.buildItem(
					result,
					parentKey.concat(key),
					parentFullKey.concat(key),
					item.dynamicChildren![key]
				);
			});
		}
		if (item.wildcard) {
			result.push({
				relativeKey: parentKey,
				fullKey: parentFullKey,
				value: item.wildcard.value,
				isWildcard: true,
			});
		}
	}

	/**
	 * Build the item array
	 */
	private buildItem(
		result: RouteItem[],
		parentKey: string[],
		parentFullKey: string[],
		item: RouteTreeItem
	) {
		// When there is a page, build it with a children prop
		if (item.page) {
			const children: RouteItem[] = [];
			this.buildChildren(children, [], parentFullKey, item);
			const resultItem: RouteItem = {
				relativeKey: parentKey,
				fullKey: parentFullKey,
				value: item.page.value,
			};
			if (children.length > 0) {
				resultItem.children = children;
			}
			result.push(resultItem);
			return;
		}

		// Else, build the children on the same level as the parent
		this.buildChildren(result, parentKey, parentFullKey, item);
	}

	/**
	 * Build the array from the root
	 */
	build(baseKey?: string[]): RouteItem[] {
		const result: RouteItem[] = [];
		const base = baseKey ?? [];
		this.buildItem(result, base, base, this.root);
		return result;
	}
}
