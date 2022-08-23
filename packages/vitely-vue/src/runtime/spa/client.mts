import App from 'virtual:vitely/vue/app.vue';
import { createApp } from 'vue';
import { setupApp } from '../setup-app.mjs';

async function main() {
	const app = createApp(App);
	const { router } = await setupApp(app);
	await router.isReady();
	app.mount('#app');
}

void main();
