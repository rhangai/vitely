import { runMiddlewares } from 'virtual:vitely/vue2/middlewares';
import { setupPlugins } from 'virtual:vitely/vue2/plugins';
import { createRouter } from 'virtual:vitely/vue2/router';
import { createStore } from 'virtual:vitely/vue2/store';
import { default as Vue, Component } from 'vue';
import { default as VueRouter, RawLocation } from 'vue-router';

Vue.use(VueRouter);

type SetupAppSSR = {
	fetchState: Record<string, any>;
	fetchStatePromises: Record<string, Promise<any>>;
};

type SetupAppOptions = {
	component: Component;
	ssr: SetupAppSSR | null;
};

export async function setupApp({ component, ssr }: SetupAppOptions) {
	const { router } = createRouter();
	const { store } = createStore();

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

	const options = {
		router,
		store,
	};

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
		provide: {
			'#ssr': ssr,
		},
		components: {
			Root: component,
		},
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
