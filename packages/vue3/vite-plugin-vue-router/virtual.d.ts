declare module 'virtual:router-data' {
	export const pagesModules: Record<string, any>;
	export const pagesRoot: string;
	export function createHistory(): any;
}

declare module 'virtual:router' {
	export function createRouter(): any;
}
