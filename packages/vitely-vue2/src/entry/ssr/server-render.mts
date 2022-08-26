import { serializeValue } from '@vitely/core';
import App from 'virtual:vitely/vue2/app.vue';
import { unref } from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRenderer } from 'vue-server-renderer';
import { setupApp } from '../setup-app.mjs';
import { type SSRContext } from './context.mjs';

type RenderResult = {
	redirect: string | null;
	status?: number | undefined;
	renderedHtml: string;
	renderedBody: string;
};

export async function render(url: string): Promise<RenderResult> {
	const ssrData = {
		fetchStatePromises: {},
		fetchState: {},
	};
	const { app, router, store } = await setupApp({
		component: App,
		ssr: ssrData,
	});

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
			renderedHtml: '',
			renderedBody: '',
		};
	}
	const renderer = createRenderer();
	const renderedHtml: string = await renderer.renderToString(app);

	return {
		redirect: null,
		status: router.currentRoute?.meta?.status as number | undefined,
		renderedHtml,
		renderedBody: serializeContext({
			fetchState: ssrData.fetchState,
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
