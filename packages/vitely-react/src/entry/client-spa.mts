import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { AppContextValue } from '../hook/app-context.mjs';
// eslint-disable-next-line import/extensions
import { setupApp } from './setup-app.mjs';

async function main() {
	const { Root } = await setupApp();

	// eslint-disable-next-line no-undef
	const app = createRoot(document.getElementById('app')!);

	// Render
	const context: AppContextValue = {
		logger: console,
		serverPrefetch: {},
		serverPrefetchState: {},
	};
	app.render(createElement(Root, { context }));
}

void main();
