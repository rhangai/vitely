import { serializeValue } from '@vitely/core';
import { type HtmlSsrRenderParams } from '@vitely/core/server';
import App from 'virtual:vitely/vue2/app.vue';
import { unref } from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRenderer } from 'vue-server-renderer';
import { SSR_CONTEXT_KEY } from '../../composition/internals.js';
import { setupApp } from '../setup-app.mjs';
import { type SSRContext } from './context.mjs';

type RenderResult = {
	redirect: string | null;
	status?: number | undefined;
	renderParams: HtmlSsrRenderParams;
};

type SetupAppSSR = {
	fetchState: Record<string, any>;
	fetchStatePromises: Record<string, Promise<any>>;
};

export async function render(url: string): Promise<RenderResult> {
	const ssrData: SetupAppSSR = {
		fetchStatePromises: {},
		fetchState: {},
	};
	const { app, router, store } = await setupApp({
		component: App,
		provide: {
			[SSR_CONTEXT_KEY as symbol]: ssrData,
		},
	});

	await router.push(url);

	await new Promise<void>((resolve) => {
		router.onReady(() => {
			resolve();
		});
	});

	// Redirect
	if (router.currentRoute.path !== url) {
		return {
			redirect: router.currentRoute.path,
			renderParams: {},
		};
	}
	const renderer = createRenderer();
	const renderedApp: string = await renderer.renderToString(app);

	const renderParams: HtmlSsrRenderParams = {
		app: renderedApp,
		body: serializeContext({
			fetchState: ssrData.fetchState,
			store: unref(store?.state.value),
		}),
	};

	return {
		redirect: null,
		status: router.currentRoute?.meta?.status as number | undefined,
		renderParams,
	};
}

function serializeContext(context: SSRContext) {
	const serialized = serializeValue({
		context,
	});
	return `<script>window.__VITELY__=${serialized}</script>`;
}
