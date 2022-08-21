// @ts-ignore
import { renderToString } from 'vue/server-renderer';
import { createApp } from '../ssr/index.js';

export async function render(url: string) {
	const { app, router } = await createApp();

	await router.push(url);
	await router.isReady();

	const ssrContext = {};
	const renderedHtml = await renderToString(app, ssrContext);
	return {
		renderedHtml,
		ssrContext,
	};
}
