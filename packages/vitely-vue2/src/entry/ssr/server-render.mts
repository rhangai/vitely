import { serializeValue } from '@vitely/core';
import { type HtmlSsrRenderParams } from '@vitely/core/server';
import App from 'virtual:vitely/vue2/app.vue';
import { VueMetaPlugin } from 'vue-meta';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRenderer } from 'vue-server-renderer';
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
	meta: VueMetaPlugin;
};

export async function render(url: string): Promise<RenderResult> {
	const { app, router, storeState } = await setupApp({
		component: App,
		provide: undefined,
	});

	const ssrContext: SetupAppSSR = {
		fetchStatePromises: {},
		fetchState: {},
		// @ts-ignore
		meta: app.$meta(),
	};

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
	const renderedApp: string = await renderer.renderToString(app, ssrContext);

	const { title, htmlAttrs, link, style, script, noscript, meta } =
		ssrContext.meta.inject();

	const renderParams: HtmlSsrRenderParams = {
		htmlAttrs: htmlAttrs?.text(),
		head: [
			//
			meta?.text(),
			title?.text(),
			link?.text(),
			style?.text(),
			script?.text(),
			noscript?.text(),
		],
		app: renderedApp,
		bodyPrepend: [
			style?.text({ pbody: true }),
			script?.text({ pbody: true }),
			noscript?.text({ pbody: true }),
		],
		body: [
			serializeContext({
				fetchState: ssrContext.fetchState,
				store: storeState(),
			}),
			style?.text({ body: true }),
			script?.text({ body: true }),
			noscript?.text({ body: true }),
		],
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
