import { serializeValue } from '@vitely/core';
import { type HtmlSsrRenderParams } from '@vitely/core/server';
import App from 'virtual:vitely/vue/app.vue';
import { createSSRApp } from 'vue';
// @ts-ignore
import { renderToString } from 'vue/server-renderer';
import { setupApp } from '../setup-app.mjs';
import { type SSRContext } from './context.mjs';

type RenderResult = {
	redirect: string | null;
	status?: number | undefined;
	renderParams: HtmlSsrRenderParams;
};

export async function render(url: string): Promise<RenderResult> {
	const app = createSSRApp(App);
	const { router, storeState } = await setupApp(app);

	await router.push(url);
	await router.isReady();

	// Redirect
	if (router.currentRoute.value.path !== url) {
		return {
			redirect: router.currentRoute.value.path,
			renderParams: {},
		};
	}

	const ssrContext = {
		fetchStatePromises: {},
		fetchState: {},
	};
	const renderedApp: string = await renderToString(app, ssrContext);

	const renderParams: HtmlSsrRenderParams = {
		body: serializeContext({
			fetchState: ssrContext.fetchState,
			store: storeState(),
		}),
		app: renderedApp,
	};

	return {
		redirect: null,
		status: router.currentRoute.value?.meta?.status as number | undefined,
		renderParams,
	};
}

function serializeContext(context: SSRContext) {
	const serialized = serializeValue({
		context,
	});
	return `<script>window.__VITELY__=${serialized}</script>`;
}
