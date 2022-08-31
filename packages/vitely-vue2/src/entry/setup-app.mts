import { runMiddlewares } from 'virtual:vitely/core/middlewares';
import { setupPlugins } from 'virtual:vitely/core/plugins';
import { App } from 'virtual:vitely/vue2/app';
import { createHead } from 'virtual:vitely/vue2/head';
import { createRouter } from 'virtual:vitely/vue2/router';
import { createStore } from 'virtual:vitely/vue2/store';
import { default as Vue } from 'vue';
import { RawLocation, RouterLink, RouterView } from 'vue-router';
import { default as VitelyVuePlugin } from '../runtime/components/index.js';
import type {
	VitelyPluginContext,
	VitelyMiddlewareContext,
} from '../types.mjs';

type SetupAppOptions = {
	provide: undefined | Record<string | symbol, unknown>;
};

// Install plugins
if (process.env.VITELY_VUE2_USE_COMPONENTS) {
	Vue.use(VitelyVuePlugin);
}
if (process.env.VITELY_VUE2_SHIM_NUXT2) {
	Vue.component('nuxt-child', RouterView);
	Vue.component('nuxt-link', RouterLink);
}

/**
 * Setup the application
 */
export async function setupApp({ provide: provideParam }: SetupAppOptions) {
	const options = {};

	const { router } = createRouter(options);
	const { store, storeState } = createStore(options);
	createHead(options);

	// Provide plugin
	const provideValues = { ...provideParam };
	const provide = (key: any, value: any): void => {
		provideValues[key] = value;
	};
	const inject = (key: any): any => {
		if (!(key in provideValues)) {
			throw new Error(`Value ${key.toString()} not provided.`);
		}
		return provideValues[key];
	};

	// Run the middleware
	router.beforeEach(async (to, from, routerNext) => {
		try {
			let nextRoute: RawLocation | undefined;
			const next = (route: RawLocation) => {
				nextRoute = route;
			};
			await runMiddlewares<VitelyMiddlewareContext>({
				context: {
					route: to,
					routeFrom: from,
					router,
					store,
					inject,
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
			provide,
			inject,
			onRootSetup,
		},
	});

	// Call the constructor
	const app = new Vue({
		...options,
		provide: provideValues,
		setup() {
			for (const setup of setups) {
				setup();
			}
		},
		render(h) {
			return h(App);
		},
	});

	return {
		app,
		router,
		store,
		storeState,
	};
}
