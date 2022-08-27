import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { type RenderResult } from 'virtual:vitely/core/render';
import { setupApp } from './setup-app.mjs';

export async function render(_url: string): Promise<RenderResult> {
	const { App } = await setupApp();
	const appHtml = renderToString(createElement(App));
	return {
		redirect: null,
		status: null,
		renderParams: {
			app: appHtml,
		},
	};
}
