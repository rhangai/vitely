import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
// eslint-disable-next-line import/extensions
import { setupApp } from './setup-app.mjs';

async function main() {
	const { Root } = await setupApp();

	// Render
	const context = {};
	const Component = () => null;
	hydrateRoot(
		// eslint-disable-next-line no-undef
		document.getElementById('app')!,
		createElement(Root, { Component, context })
	);
}

void main();
