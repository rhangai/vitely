import { renderHeadToString } from '@vueuse/head';
import { RenderFunction, type RenderParams } from 'virtual:vitely/core/render';
import App from 'virtual:vitely/vue/app.vue';
import { createSSRApp } from 'vue';
// @ts-ignore
import { renderToString } from 'vue/server-renderer';
import { VitelyVueRuntimeContext } from '../runtime/runtime-context.mjs';
import { setupApp } from './setup-app.mjs';

export const render: RenderFunction<VitelyVueRuntimeContext> = async (
	url: string
) => {
	const app = createSSRApp(App);
	const { router, storeState, head } = await setupApp(app);

	await router.push(url);
	await router.isReady();

	// Redirect
	if (router.currentRoute.value.path !== url) {
		return {
			redirect: router.currentRoute.value.path,
		};
	}

	const ssrContext = {
		fetchStatePromises: {},
		fetchState: {},
	};
	const renderedApp: string = await renderToString(app, ssrContext);
	const { headTags, htmlAttrs, /* bodyAttrs, */ bodyTags } =
		renderHeadToString(head);

	const renderParams: RenderParams = {
		htmlAttrs,
		head: headTags,
		body: [bodyTags],
		app: renderedApp,
	};

	return {
		redirect: null,
		status: router.currentRoute.value?.meta?.status as number | undefined,
		context: {
			fetchState: ssrContext.fetchState,
			store: storeState(),
		},
		renderParams,
	};
};
