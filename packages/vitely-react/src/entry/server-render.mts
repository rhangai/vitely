import { PassThrough } from 'node:stream';
import { serializeValue } from '@vitely/core';
import { createElement } from 'react';
import {
	PipeableStream,
	renderToPipeableStream,
	renderToString,
} from 'react-dom/server';
import { type RenderResult } from 'virtual:vitely/core/render';
import { AppContextValue } from '../hook/app-context.mjs';
import { setupApp } from './setup-app.mjs';

export async function render(_url: string): Promise<RenderResult> {
	const { Root } = await setupApp();

	const { context, resolve } = createLazyResolver();

	const component = createElement(Root, { context });

	/*
	Must run twice
	 - First time collect the async hooks
	 - Second time renders using the fetched values
	 */
	await streamToPromise(renderToPipeableStream(component));
	await resolve();
	const appHtml = renderToString(component);

	return {
		redirect: null,
		status: null,
		renderParams: {
			app: appHtml,
			body: [
				serializeContext({
					serverPrefetchState: context.serverPrefetchState,
				}),
			],
		},
	};
}

async function streamToPromise(stream: PipeableStream) {
	const passThrough = new PassThrough();
	stream.pipe(passThrough);
	await new Promise<void>((resolve, reject) => {
		passThrough
			.on('data', () => {
				// Ignore the data
			})
			.on('error', reject)
			.on('end', () => resolve());
	});
}

function createLazyResolver() {
	const context: AppContextValue = {
		serverPrefetch: {},
		serverPrefetchState: {},
	};
	return {
		context,
		async resolve() {
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
