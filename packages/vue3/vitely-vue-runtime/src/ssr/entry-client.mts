import { createApp } from './create-app.mjs';

async function main() {
	const { app, router } = await createApp();
	await router.isReady();
	app.mount('#app');
}

void main();
