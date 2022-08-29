import { setupApp } from './setup-app.mjs';

async function main() {
	const { app, router } = await setupApp({
		provide: undefined,
	});
	router.onReady(() => {
		app.$mount('#app');
	});
}

void main();
