import { runMiddlewares } from 'virtual:vitely/vue/middlewares';
import { setupPlugins } from 'virtual:vitely/vue/plugins';
import { createRouter } from 'virtual:vitely/vue/router';
import { createStore } from 'virtual:vitely/vue/store';
import type { App } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export async function setupApp(app: App) {
	const { router } = createRouter();
	const { store } = createStore();

	// Setup the store
	if (store) {
		app.use(store);
	}

	// Setup the router
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
					store,
				},
				routeChanged() {
					return !!nextRoute;
				},
			});
			return nextRoute;
		}
	);

	// Setup the plugins
	await setupPlugins({
		context: {
			app,
		},
	});

	return {
		app,
		router,
		store,
	};
}
