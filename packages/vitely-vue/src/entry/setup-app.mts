import { runMiddlewares } from 'virtual:vitely/core/middlewares';
import { setupPlugins } from 'virtual:vitely/core/plugins';
import { createHead } from 'virtual:vitely/vue/head';
import { createRouter } from 'virtual:vitely/vue/router';
import { createStore } from 'virtual:vitely/vue/store';
import type { App } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import type {
	VitelyMiddlewareContext,
	VitelyPluginContext,
} from '../types/index.mjs';

export async function setupApp(app: App) {
	const { router } = createRouter();
	const { store, storeState } = createStore();
	const { head } = createHead();

	// Setup the store
	if (store) {
		app.use(store);
	}

	// Setup the router
	app.use(router);
	app.use(head);

	// Run the middleware
	router.beforeEach(
		async (to, from): Promise<RouteLocationRaw | undefined> => {
			let nextRoute: RouteLocationRaw | undefined;
			const next = (route: RouteLocationRaw) => {
				nextRoute = route;
			};
			await runMiddlewares<VitelyMiddlewareContext>({
				context: {
					to,
					from,
					next,
					store,
					router,
				},
				routeChanged() {
					return !!nextRoute;
				},
			});
			return nextRoute;
		}
	);

	// Setup the plugins
	await setupPlugins<VitelyPluginContext>({
		context: {
			app,
			router,
			store,
			head,
		},
	});

	return {
		app,
		router,
		store,
		storeState,
		head,
	};
}
