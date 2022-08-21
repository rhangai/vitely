declare module 'virtual:@vitely/vite-plugin-router/pages-modules' {
	export const pagesModules: Record<string, any>;
	export const pagesRoot: string;
	export function createHistory(): any;
}
