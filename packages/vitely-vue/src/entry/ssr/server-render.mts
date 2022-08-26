import { serializeValue } from '@vitely/core';
import App from 'virtual:vitely/vue/app.vue';
import { createSSRApp, unref } from 'vue';
// @ts-ignore
import { renderToString } from 'vue/server-renderer';
import { setupApp } from '../setup-app.mjs';
import { type SSRContext } from './context.mjs';

type RenderResult = {
	redirect: string | null;
	status?: number | undefined;
	renderedHtml: string;
	renderedBody: string;
};

export async function render(url: string): Promise<RenderResult> {
	const app = createSSRApp(App);
	const { router, store } = await setupApp(app);

	await router.push(url);
	await router.isReady();

	// Redirect
	if (router.currentRoute.value.path !== url) {
		return {
			redirect: router.currentRoute.value.path,
			renderedHtml: '',
			renderedBody: '',
		};
	}

	const ssrContext = {
		fetchStatePromises: {},
		fetchState: {},
	};
	const renderedHtml: string = await renderToString(app, ssrContext);

	return {
		redirect: null,
		status: router.currentRoute.value?.meta?.status as number | undefined,
		renderedHtml,
		renderedBody: serializeContext({
			fetchState: ssrContext.fetchState,
			store: unref(store?.state.value),
		}),
	};
}

function serializeContext(context: SSRContext) {
	const serialized = serializeValue({
		context,
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
