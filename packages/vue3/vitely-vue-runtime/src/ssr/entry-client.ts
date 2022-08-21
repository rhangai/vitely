import { createApp } from './create-app.js';

async function main() {
	const { app, router } = await createApp();
	await router.isReady();
	app.mount('#app');
}

void main();
