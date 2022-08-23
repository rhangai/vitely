import { setupPlugins } from 'virtual:vitely/vue/plugins';
import { createRouter } from 'virtual:vitely/vue/router';
import type { App } from 'vue';

export async function setupApp(app: App) {
	const { router } = createRouter();
	app.use(router);
	await setupPlugins(app);
	return {
		app,
		router,
	};
}
