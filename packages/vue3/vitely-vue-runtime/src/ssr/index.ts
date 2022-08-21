// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { createRouter } from '@vitely/vite-plugin-vue-router/runtime';
// eslint-disable-next-line import/no-unresolved
import App from 'virtual:@vitely/vue-runtime/app';
import { createSSRApp } from 'vue';

export async function createApp() {
	const app = createSSRApp(App);
	const { router, routes } = createRouter(app);
	app.use(router);
	console.log(routes);
	return {
		app,
		router,
	};
}
