import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
// eslint-disable-next-line import/extensions
import { setupApp } from './setup-app.mjs';

async function main() {
	const { Root } = await setupApp();

	// eslint-disable-next-line no-undef
	const app = createRoot(document.getElementById('app')!);

	// Render
	const context = {};
	const Component = () => null;
	app.render(createElement(Root, { Component, context }));
}

void main();
