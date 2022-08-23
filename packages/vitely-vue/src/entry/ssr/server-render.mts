import App from 'virtual:vitely/vue/app.vue';
import { createSSRApp } from 'vue';
// @ts-ignore
import { renderToString } from 'vue/server-renderer';
import { setupApp } from '../setup-app.mjs';

export async function render(url: string, ssrContext: Record<string, any>) {
	const app = createSSRApp(App);
	const { router } = await setupApp(app);

	await router.push(url);
	await router.isReady();

	const renderedHtml = await renderToString(app, ssrContext);

	return {
		status: router.currentRoute.value?.meta?.status as number | undefined,
		renderedHtml,
	};
}
