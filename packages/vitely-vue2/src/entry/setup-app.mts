import { runMiddlewares } from 'virtual:vitely/vue2/middlewares';
import { setupPlugins } from 'virtual:vitely/vue2/plugins';
import { createRouter } from 'virtual:vitely/vue2/router';
import { createStore } from 'virtual:vitely/vue2/store';
import { default as Vue, Component } from 'vue';
import { RawLocation } from 'vue-router';

type SetupAppOptions = {
	component: Component;
	provide: undefined | Record<string | symbol, unknown>;
};

export async function setupApp({ component, provide }: SetupAppOptions) {
	const options = {};

	const { router } = createRouter(options);
	const { store } = createStore(options);

	// Run the middleware
	router.beforeEach(async (to, from, routerNext) => {
		try {
			let nextRoute: RawLocation | undefined;
			const next = (route: RawLocation) => {
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
			routerNext(nextRoute);
		} catch (err) {
			routerNext();
		}
	});

	// Setup the plugins
	await setupPlugins({
		context: {
			router,
			store,
			options,
		},
	});

	// Call the constructor
	const app = new Vue({
		...options,
		provide,
		render(h) {
			return h(component);
		},
	});

	return {
		app,
		router,
		store,
	};
}
