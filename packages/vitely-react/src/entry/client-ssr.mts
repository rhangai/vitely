import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { AppContextValue } from '../hook/app-context.mjs';
// eslint-disable-next-line import/extensions
import { setupApp } from './setup-app.mjs';

async function main() {
	const { Root } = await setupApp();

	// Render
	const context: AppContextValue = {
		serverPrefetch: {},
		serverPrefetchState: {},
		// @ts-ignore
		// eslint-disable-next-line no-underscore-dangle, no-undef
		...window?.__VITELY__?.context,
	};
	const Component = () => null;
	hydrateRoot(
		// eslint-disable-next-line no-undef
		document.getElementById('app')!,
		createElement(Root, { Component, context })
	);
}

void main();
