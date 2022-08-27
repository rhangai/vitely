import { PassThrough } from 'node:stream';
import { serializeValue } from '@vitely/core';
import getStream from 'get-stream';
import { createElement, lazy } from 'react';
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

	const { Component, context, resolve } = createLazyResolver();

	const component = createElement(Root, { Component, context });

	const stream = renderToPipeableStream(component, {
		onShellReady() {
			void resolve();
		},
	});
	await streamToPromise(stream);

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
				/* Ignora */
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

	let promiseResolve: any;
	const promise = new Promise<any>((resolve) => {
		promiseResolve = resolve;
	});
	const Component = lazy(() => promise);
	return {
		Component,
		context,
		async resolve() {
			await Promise.all(Object.values(context.serverPrefetch));
			promiseResolve({
				default: () => {
					return null;
				},
			});
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
