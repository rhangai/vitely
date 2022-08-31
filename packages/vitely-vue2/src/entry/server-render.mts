import type { RenderFunction, RenderParams } from 'virtual:vitely/core/render';
import { VueMetaPlugin } from 'vue-meta';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRenderer } from 'vue-server-renderer';
import { VitelyVue2RuntimeContext } from '../runtime/runtime-context.mjs';
import { setupApp } from './setup-app.mjs';

type SetupAppSSR = {
	fetchState: Record<string, any>;
	fetchStatePromises: Record<string, Promise<any>>;
	meta: VueMetaPlugin;
};

export const render: RenderFunction<VitelyVue2RuntimeContext> = async (
	url: string
) => {
	const { app, router, storeState } = await setupApp({
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
		};
	}
	const renderer = createRenderer();
	const renderedApp: string = await renderer.renderToString(app, ssrContext);

	const { title, htmlAttrs, link, style, script, noscript, meta } =
		ssrContext.meta.inject();

	const renderParams: RenderParams = {
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
			style?.text({ body: true }),
			script?.text({ body: true }),
			noscript?.text({ body: true }),
		],
	};

	return {
		redirect: null,
		status: router.currentRoute?.meta?.status as number | undefined,
		context: {
			fetchState: ssrContext.fetchState,
			store: storeState(),
		},
		renderParams,
	};
};
