// @ts-ignore
import { createApp } from '@vitely/vue-runtime/ssr';
import { renderToString } from 'vue/server-renderer';

export async function render(url: string) {
	const { app } = await createApp();
	const ssrContext = {};
	const renderedHtml = await renderToString(app, ssrContext);
	return {
		renderedHtml,
		ssrContext,
	};
}
