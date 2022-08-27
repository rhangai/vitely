import { type RenderResult } from 'virtual:vitely/core/render';
import { setupApp } from './setup-app.mjs';

export async function render(_url: string): Promise<RenderResult> {
	await setupApp();
	return {
		redirect: null,
		status: null,
		renderParams: {},
	};
}
