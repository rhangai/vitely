import { PassThrough } from 'node:stream';
import getStream from 'get-stream';
import { createElement, lazy } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { type RenderResult } from 'virtual:vitely/core/render';
import { AppContextValue } from '../hook/app-context.mjs';
import { setupApp } from './setup-app.mjs';

export async function render(_url: string): Promise<RenderResult> {
	const { Root } = await setupApp();

	const { Component, context, resolve } = createLazyResolver();
	const stream = renderToPipeableStream(
		createElement(Root, { Component, context }),
		{
			onShellReady() {
				void resolve();
			},
		}
	);
	const passThrough = new PassThrough();
	stream.pipe(passThrough);
	const appHtml = await getStream(passThrough);
	return {
		redirect: null,
		status: null,
		renderParams: {
			app: appHtml,
		},
	};
}

function createLazyResolver() {
	const context: AppContextValue = {
		serverPrefetch: {},
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
					console.log('Render default');
					return null;
				},
			});
		},
	};
}
