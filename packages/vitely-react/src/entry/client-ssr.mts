import { getVitelyRuntimeContext } from '@vitely/core/runtime';
import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { AppContextValue } from '../hook/app-context.mjs';
import { VitelyReactRuntimeContext } from '../runtime/runtime-context.mjs';
// eslint-disable-next-line import/extensions
import { setupApp } from './setup-app.mjs';

async function main() {
	const { Root } = await setupApp();

	//
	const serverPrefetchState =
		getVitelyRuntimeContext<VitelyReactRuntimeContext>()
			?.serverPrefetchState;

	// Render
	const context: AppContextValue = {
		logger: console,
		serverPrefetch: {},
		serverPrefetchState: { ...serverPrefetchState },
	};
	hydrateRoot(
		// eslint-disable-next-line no-undef
		document.getElementById('app')!,
		createElement(Root, { context })
	);
}

void main();
