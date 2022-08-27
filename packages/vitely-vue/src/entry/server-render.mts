import { serializeValue } from '@vitely/core';
import { renderHeadToString } from '@vueuse/head';
import { type RenderResult } from 'virtual:vitely/core/render';
import App from 'virtual:vitely/vue/app.vue';
import { createSSRApp } from 'vue';
// @ts-ignore
import { renderToString } from 'vue/server-renderer';
import { setupApp } from './setup-app.mjs';

export async function render(url: string): Promise<RenderResult> {
	const app = createSSRApp(App);
	const { router, storeState, head } = await setupApp(app);

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
	const { headTags, htmlAttrs, /* bodyAttrs, */ bodyTags } =
		renderHeadToString(head);

	const renderParams: RenderResult['renderParams'] = {
		htmlAttrs,
		head: headTags,
		body: [
			bodyTags,
			serializeContext({
				fetchState: ssrContext.fetchState,
				store: storeState(),
			}),
		],
		app: renderedApp,
	};

	return {
		redirect: null,
		status: router.currentRoute.value?.meta?.status as number | undefined,
		renderParams,
	};
}

type SerializeContextParam = {
	fetchState: Record<string, any>;
	store: Record<string, any> | undefined;
};
function serializeContext(context: SerializeContextParam) {
	const serialized = serializeValue({
		context,
	});
	return `<script>window.__VITELY__=${serialized}</script>`;
}
