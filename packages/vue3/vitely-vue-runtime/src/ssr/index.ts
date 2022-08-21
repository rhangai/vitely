// eslint-disable-next-line import/no-unresolved
import App from 'virtual:@vitely/vue-runtime/app';
import { createSSRApp } from 'vue';

export async function createApp() {
	const app = createSSRApp(App);
	return {
		app,
	};
}
