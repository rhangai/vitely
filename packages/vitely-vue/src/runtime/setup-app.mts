import { createRouter } from 'virtual:vue-router';
import type { App } from 'vue';

export async function setupApp(app: App) {
	const { router } = createRouter();
	app.use(router);
	return {
		app,
		router,
	};
}
