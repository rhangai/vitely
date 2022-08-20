import { resolve } from 'path';
import { ModuleMap } from '../util/virtual-modules';
import { VitelyContext } from '../context';

function createModuleApp(srcDir: string, ssr: boolean) {
	const createApp = ssr ? 'createSSRApp' : 'createApp';
	return `
		import { ${createApp} as createVueApp } from 'vue';
		import { createRouter } from 'virtual:@vitely/router';
		import App from '${srcDir}/app.vue';

		const modules = import.meta.globEager('${srcDir}/setup.ts');

		export function createApp() {
			const app = createVueApp(App);
			const { router } = createRouter();
			app.use(router);
			modules['${srcDir}/setup.ts']?.default?.(app);
			return { app, router };
		}
	`;
}

function createModuleRouter(srcDir: string, ssr: boolean) {
	const history = ssr ? 'createMemoryHistory' : 'createWebHistory';
	return `
		import { createRouter as createVueRouter, ${history} as history } from 'vue-router';
		import { buildRoutesVueRouter } from '@vitely/runtime';

		const modules = import.meta.glob('${srcDir}/pages/**/*.{vue,ts,tsx,js,jsx}');
		const { routes } = buildRoutesVueRouter('${srcDir}/pages', modules, { vueRouter4: true });

		export function createRouter() {
			const router = createVueRouter({
				history: history(),
				routes,
			});
			return { router, routes };
		}
	`;
}

function createModuleMain() {
	return `
		import { createApp } from 'virtual:@vitely/app';

		const { app } = createApp();
		app.mount('#app');
	`;
}

function createModuleMainSsr() {
	return `
		import { renderToString } from '@vue/server-renderer';
		import { createApp } from 'virtual:@vitely/app';

		export async function render(templateHtml, url) {
			const { app, router } = createApp();
			router.push(url);
			await router.isReady();
			const ctx = {};
			const content = await renderToString(app, ctx);
			return { 
				html: templateHtml.replace('<!--app-html-->', content),
				status: router.currentRoute.value?.meta.status ?? 200,
			};
		}
	`;
}

export default function modulesVue3(ctx: VitelyContext): ModuleMap {
	const srcDir = resolve('/', ctx.srcDir);
	return {
		'virtual:@vitely/app': createModuleApp(srcDir, ctx.ssr),
		'virtual:@vitely/router': createModuleRouter(srcDir, ctx.ssr),
		[ctx.mainModule]: ctx.ssr ? createModuleMainSsr() : createModuleMain(),
	};
}
