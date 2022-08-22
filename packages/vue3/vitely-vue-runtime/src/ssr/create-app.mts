import App from 'virtual:app.vue';
import { createRouter } from 'virtual:router';
import { createSSRApp } from 'vue';

export async function createApp() {
	const app = createSSRApp(App);
	const { router } = createRouter();
	app.use(router);
	return {
		app,
		router,
	};
}
