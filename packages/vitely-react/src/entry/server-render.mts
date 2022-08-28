import { PassThrough } from 'node:stream';
import { serializeValue } from '@vitely/core';
import { createElement, ReactNode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { FilledContext } from 'react-helmet-async';
import type { RenderFunction, RenderContext } from 'virtual:vitely/core/render';
import { AppContextValue } from '../hook/app-context.mjs';
import { setupApp } from './setup-app.mjs';

export const render: RenderFunction = async (url, ctx) => {
	const { Root } = await setupApp();
	const helmetContext = {};
	const { context, resolveServerPrefetch } = createLazyResolver(ctx);
	const component = createElement(Root, { context, url, helmetContext });

	/*
	If serverPrefetch is enabled, the server must run twice
	 - First time collect the async hooks
	 - Second time renders using the fetched values
	 */
	let appHtml;
	if (context.serverPrefetchEnabled) {
		await renderComponent(component, false);
		await resolveServerPrefetch();
		appHtml = await renderComponent(component, true);
	} else {
		appHtml = await renderComponent(component, true);
	}
	const { helmet } = helmetContext as unknown as FilledContext;

	return {
		redirect: null,
		status: null,
		renderParams: {
			htmlAttrs: helmet.htmlAttributes.toString(),
			head: [
				helmet.title.toString(),
				helmet.priority.toString(),
				helmet.base.toString(),
				helmet.meta.toString(),
				helmet.link.toString(),
				helmet.style.toString(),
			],
			app: appHtml,
			body: [
				serializeContext({
					serverPrefetchState: context.serverPrefetchState,
				}),
				helmet.script.toString(),
				helmet.noscript.toString(),
			],
		},
	};
};

async function renderComponent(component: ReactNode, returnString: boolean) {
	const stream = renderToPipeableStream(component);
	const passThrough = new PassThrough();
	stream.pipe(passThrough);

	const buffers: Buffer[] = [];
	await new Promise<void>((resolve, reject) => {
		passThrough
			.on('data', (buffer) => {
				if (returnString) {
					buffers.push(buffer);
				}
			})
			.on('error', reject)
			.on('end', () => resolve());
	});
	return Buffer.concat(buffers).toString('utf8');
}

function createLazyResolver({ logger }: RenderContext) {
	const context: AppContextValue = {
		logger,
		serverPrefetchEnabled: true,
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
