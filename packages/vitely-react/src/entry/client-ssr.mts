import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
// eslint-disable-next-line import/extensions
import { setupApp } from './setup-app.mjs';

async function main() {
	const { App } = await setupApp();

	// Render
	// eslint-disable-next-line no-undef
	hydrateRoot(document.getElementById('app')!, createElement(App));
}

void main();
