declare module 'virtual:vitely/react/app.tsx' {
	import { Component } from 'react';

	export default Component;
}

declare module 'virtual:vitely/react/router-data' {
	import { type Component } from 'react';

	export const pagesRoot: string;
	export const pagesModules: Record<string, () => unknown>;
	export const Router: Component;
}
