import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
// eslint-disable-next-line import/extensions
import { setupApp } from './setup-app.mjs';

async function main() {
	const { App } = await setupApp();

	// Render
	// eslint-disable-next-line no-undef
	const app = createRoot(document.getElementById('app')!);
	app.render(createElement(App));
}

void main();
