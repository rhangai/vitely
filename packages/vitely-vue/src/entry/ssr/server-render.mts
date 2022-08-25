import { serializeValue } from '@vitely/core';
import App from 'virtual:vitely/vue/app.vue';
import { createSSRApp } from 'vue';
// @ts-ignore
import { renderToString } from 'vue/server-renderer';
import { setupApp } from '../setup-app.mjs';

type RenderResult = Awaited<ReturnType<typeof render>>;

export async function render(url: string) {
	const app = createSSRApp(App);
	const { router } = await setupApp(app);

	await router.push(url);
	await router.isReady();

	const ssrContext = {
		fetchStatePromises: {},
		fetchState: {},
	};
	const renderedHtml = await renderToString(app, ssrContext);

	return {
		status: router.currentRoute.value?.meta?.status as number | undefined,
		renderedHtml,
		renderedBody: serializeContext(ssrContext),
	};
}

function serializeContext(ssrContext: any) {
	const serialized = serializeValue({
		context: {
			fetchState: ssrContext.fetchState,
		},
	});
	return `<script>window.__VITELY__=${serialized}</script>`;
}

export async function createHtmlRenderer(html: string) {
	return ({ renderedHtml, renderedBody }: RenderResult) => {
		const ssrHtml = html.replace(
			/<!--\s*ssr\s*-->\s*<\/div>/,
			`${renderedHtml}</div>${renderedBody}`
		);
		return ssrHtml;
	};
}
