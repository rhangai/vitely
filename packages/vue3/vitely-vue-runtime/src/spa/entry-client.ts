// eslint-disable-next-line import/no-unresolved
import App from 'virtual:@vitely/vue-runtime/app';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { createRouter } from 'virtual:router';
import { createApp } from 'vue';

async function main() {
	const app = createApp(App);
	const { router } = createRouter();
	app.use(router);
	await router.isReady();
	app.mount('#app');
}

void main();
