import { runMiddlewares } from 'virtual:vitely/vue/middlewares';
import { setupPlugins } from 'virtual:vitely/vue/plugins';
import { createRouter } from 'virtual:vitely/vue/router';
import type { App } from 'vue';
import { RouteLocationRaw } from 'vue-router';

export async function setupApp(app: App) {
	const { router } = createRouter();
	app.use(router);

	// Run the middleware
	router.beforeEach(
		async (to, from): Promise<RouteLocationRaw | undefined> => {
			let nextRoute: RouteLocationRaw | undefined;
			const next = (route: RouteLocationRaw) => {
				nextRoute = route;
			};
			await runMiddlewares({
				context: {
					to,
					from,
					next,
				},
				routeChanged() {
					return !!nextRoute;
				},
			});
			return nextRoute;
		}
	);

	// Setup the plugins
	await setupPlugins(app);

	return {
		app,
		router,
	};
}
