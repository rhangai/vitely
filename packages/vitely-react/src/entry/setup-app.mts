import { setupPlugins } from 'virtual:vitely/core/plugins';

export async function setupApp() {
	// Setup the plugins
	await setupPlugins({
		context: {},
	});

	return {};
}
