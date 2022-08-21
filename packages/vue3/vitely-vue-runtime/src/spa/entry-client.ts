import { createRouter } from '@vitely/vite-plugin-vue-router/runtime';
// eslint-disable-next-line import/no-unresolved
import App from 'virtual:@vitely/vue-runtime/app';
import { createApp } from 'vue';

async function main() {
	const app = createApp(App);
	const { router } = createRouter(app);
	app.use(router);
	await router.isReady();
	app.mount('#app');
}

void main();
