import { resolve } from 'path';
import { VitelyContext } from '../context';
import { ModuleMap } from '../util/virtual-modules';

function createModuleApp(srcDir: string) {
	return `
		import Vue from 'vue';
		import { createRouter } from 'virtual:@vitely/router';
		import AppComponent from '${srcDir}/app.vue';

		const modules = import.meta.globEager('${srcDir}/setup.ts');

		const { router } = createRouter(Vue);
		const options = modules['${srcDir}/setup.ts']?.default?.(Vue, { router });
		const App = Vue.extend(AppComponent);

		export function createApp(userOptions) {
			const app = new App({
				router,
				...options,
				...userOptions,
			});
			return { app };
		}
	`;
}

function createModuleRouter(srcDir: string, ssr: boolean) {
	return `
		import VueRouter from 'vue-router';
		import { buildRoutesVueRouter } from '@vitely/runtime';

		const modules = import.meta.glob('${srcDir}/pages/**/*.{vue,ts,tsx,js,jsx}');
		const { routes } = buildRoutesVueRouter('${srcDir}/pages', modules);

		export function createRouter(vue) {
			vue.use(VueRouter);
			const router = new VueRouter({
				mode: '${ssr ? 'abstract' : 'history'}',
				routes,
			});
			return { router, routes };
		}
	`;
}

function createModuleMain() {
	return `
		import { createApp } from 'virtual:@vitely/app';

		const { app } = createApp({ el: '#app' });
	`;
}

function createModuleMainSsr() {
	return `
		import { createRenderer } from 'vue-server-renderer';
		import { createApp } from 'virtual:@vitely/app';

		const renderer = createRenderer();
		export async function render() {
			const { app } = createApp();
			const html = await renderer.renderToString();
			return { html };
		}
	`;
}

export default function modulesVue2(ctx: VitelyContext): ModuleMap {
	const srcDir = resolve('/', ctx.srcDir);
	return {
		'virtual:@vitely/app': createModuleApp(srcDir),
		'virtual:@vitely/router': createModuleRouter(srcDir, ctx.ssr),
		[ctx.mainModule]: ctx.ssr ? createModuleMainSsr() : createModuleMain(),
	};
}
