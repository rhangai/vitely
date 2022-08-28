import { describe, expect, it } from 'vitest';
import { createHtmlSsrRender } from './html-ssr-render.mjs';

describe('html-ssr-render', () => {
	it('should render basic html', async () => {
		const HTML = `<html><head></head><body><div id="app"></div></body></html>`;
		const renderer = await createHtmlSsrRender(HTML);
		const { html } = renderer({
			htmlAttrs: 'lang="en"',
			head: '<title>Some Page Title</title>',
			bodyAttrs: 'style="display: none"',
			body: '<script>console.log("OK")</script>',
			app: '<div>HTML</div>',
		});
		expect(html).toMatch(
			`<html lang="en"><head><title>Some Page Title</title></head><body style="display: none"><div id="app"><div>HTML</div></div><script>console.log("OK")</script></body></html>`
		);
	});

	it('should keep head contents', async () => {
		const HTML = `<html><head><meta charset="utf-8"></head><body><div id="app"></div></body></html>`;
		const renderer = await createHtmlSsrRender(HTML);
		const { html } = renderer({
			head: '<title>Some Page Title</title>',
			app: 'rendered',
		});
		expect(html).toMatch(
			`<html><head><meta charset="utf-8"><title>Some Page Title</title></head><body><div id="app">rendered</div></body></html>`
		);
	});
	it('should keep body contents', async () => {
		const HTML = `<html><head></head><body><div id="app"></div><script src="some-script"></script></body></html>`;
		const renderer = await createHtmlSsrRender(HTML);
		const { html } = renderer({
			bodyPrepend: '<style>.app{color:#ff0}</style>',
			body: '<script src="more-body"></script>',
			app: 'rendered',
		});
		expect(html).toMatch(
			`<html><head></head><body><style>.app{color:#ff0}</style><div id="app">rendered</div><script src="more-body"></script><script src="some-script"></script></body></html>`
		);
	});
});
