import { setupPlugins } from 'virtual:vitely/core/plugins';
import { default as Root } from './root.js';

export async function setupApp() {
	// Setup the plugins
	await setupPlugins({
		context: {},
	});

	return {
		Root,
	};
}
