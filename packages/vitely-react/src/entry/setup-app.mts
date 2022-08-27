import { setupPlugins } from 'virtual:vitely/core/plugins';
// eslint-disable-next-line import/extensions
import { default as App } from 'virtual:vitely/react/app.tsx';

export async function setupApp() {
	// Setup the plugins
	await setupPlugins({
		context: {},
	});

	return {
		App,
	};
}
