import { PassThrough } from 'node:stream';
import { serializeValue } from '@vitely/core';
import { createElement, ReactNode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { type RenderResult } from 'virtual:vitely/core/render';
import { AppContextValue } from '../hook/app-context.mjs';
import { setupApp } from './setup-app.mjs';

export async function render(url: string): Promise<RenderResult> {
	const { Root } = await setupApp();

	const { context, resolveServerPrefetch } = createLazyResolver();

	const component = createElement(Root, { context, url });

	/*
	Must run twice
	 - First time collect the async hooks
	 - Second time renders using the fetched values
	 */
	await renderComponent(component, false);
	Helmet.renderStatic();
	await resolveServerPrefetch();
	const appHtmlBuffers = await renderComponent(component, true);
	const helmet = Helmet.renderStatic();

	return {
		redirect: null,
		status: null,
		renderParams: {
			htmlAttrs: helmet.htmlAttributes.toString(),
			head: [
				helmet.title.toString(),
				helmet.base.toString(),
				helmet.meta.toString(),
				helmet.link.toString(),
				helmet.style.toString(),
			],
			app: appHtmlBuffers.toString('utf8'),
			body: [
				serializeContext({
					serverPrefetchState: context.serverPrefetchState,
				}),
				helmet.script.toString(),
				helmet.noscript.toString(),
			],
		},
	};
}

async function renderComponent(component: ReactNode, returnBuffer: boolean) {
	const stream = renderToPipeableStream(component);
	const passThrough = new PassThrough();
	stream.pipe(passThrough);

	const buffers: Buffer[] = [];
	await new Promise<void>((resolve, reject) => {
		passThrough
			.on('data', (buffer) => {
				// Ignore the data
				if (returnBuffer) {
					buffers.push(buffer);
				}
			})
			.on('error', reject)
			.on('end', () => resolve());
	});
	return Buffer.concat(buffers);
}

function createLazyResolver() {
	const context: AppContextValue = {
		serverPrefetch: {},
		serverPrefetchState: {},
	};
	return {
		context,
		async resolveServerPrefetch() {
			const noop = () => null;
			await Promise.all(
				Object.values(context.serverPrefetch).map((p) =>
					p.then(noop, noop)
				)
			);
		},
	};
}

type SerializeContextParam = {
	serverPrefetchState: Record<string, any>;
};
function serializeContext(context: SerializeContextParam) {
	const serialized = serializeValue({
		context,
	});
	return `<script>window.__VITELY__=${serialized}</script>`;
}
