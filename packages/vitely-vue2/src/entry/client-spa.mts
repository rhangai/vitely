import Component from 'virtual:vitely/vue2/app.vue';
import { setupApp } from './setup-app.mjs';

async function main() {
	const { app, router } = await setupApp({
		component: Component,
		provide: undefined,
	});
	router.onReady(() => {
		app.$mount('#app');
	});
}

void main();
