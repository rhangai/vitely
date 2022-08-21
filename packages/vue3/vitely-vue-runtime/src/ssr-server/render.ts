import { createApp } from '@vitely/vue-runtime/ssr';
// @ts-ignore
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
