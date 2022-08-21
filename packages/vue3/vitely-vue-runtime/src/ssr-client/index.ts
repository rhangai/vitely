import { createApp } from '../ssr';

async function main() {
	const { app } = await createApp();
	app.mount('#app');
}

void main();
