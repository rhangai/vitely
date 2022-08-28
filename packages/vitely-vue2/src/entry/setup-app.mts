import { runMiddlewares } from 'virtual:vitely/core/middlewares';
import { setupPlugins } from 'virtual:vitely/core/plugins';
import { createHead } from 'virtual:vitely/vue2/head';
import { createRouter } from 'virtual:vitely/vue2/router';
import { createStore } from 'virtual:vitely/vue2/store';
import { default as Vue, Component } from 'vue';
import { RawLocation } from 'vue-router';
import type {
	VitelyPluginContext,
	VitelyMiddlewareContext,
} from '../types/index.mjs';

type SetupAppOptions = {
	component: Component;
	provide: undefined | Record<string | symbol, unknown>;
};

export async function setupApp({
	component,
	provide: provideParam,
}: SetupAppOptions) {
	const options = {};

	const { router } = createRouter(options);
	const { store, storeState } = createStore(options);
	createHead(options);

	// Run the middleware
	router.beforeEach(async (to, from, routerNext) => {
		try {
			let nextRoute: RawLocation | undefined;
			const next = (route: RawLocation) => {
				nextRoute = route;
			};
			await runMiddlewares<VitelyMiddlewareContext>({
				context: {
					to,
					from,
					router,
					store,
					next,
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

	// Provide plugin
	const provide = { ...provideParam };
	const pluginProvide = (key: symbol | string, value: any) => {
		provide[key] = value;
	};

	// Hooks
	const setups: Array<() => void> = [];
	const onRootSetup = (setup: () => void) => {
		setups.push(setup);
	};

	// Setup the plugins
	await setupPlugins<VitelyPluginContext>({
		context: {
			router,
			store,
			options,
			provide: pluginProvide,
			onRootSetup,
		},
	});

	// Call the constructor
	const app = new Vue({
		...options,
		provide,
		setup() {
			for (const setup of setups) {
				setup();
			}
		},
		render(h) {
			return h(component);
		},
	});

	return {
		app,
		router,
		store,
		storeState,
	};
}
