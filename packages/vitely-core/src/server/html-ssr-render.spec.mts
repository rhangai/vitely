import { describe, it } from 'vitest';
import { createHtmlSsrRender } from './html-ssr-render.mjs';

describe('html-ssr-render', () => {
	it('should parse html', async () => {
		const HTML = `<html>
			<head>
			</head>
			<body>
				<div id="app"><!-- ssr --></div>
			</body>
		</html>`;
		const renderer = await createHtmlSsrRender(HTML);
		console.log(
			renderer({
				htmlAttrs: 'lang="pt-br"',
				head: '<title>Página</title>',
				body: '<script>console.log("OK")</script>',
				app: '<div>HTML</div>',
			})
		);
	});
});
