export type HtmlSsrRenderParams = {
	htmlAttrs?: string;
	head?: string;
	body?: string;
	app?: string;
};

/**
 * Create the html renderer
 */
export function createHtmlSsrRender(htmlParam: string) {
	const html = htmlParam.trim();
	const htmlMatch = /^<html(.*?)>/.exec(html);
	if (!htmlMatch) {
		throw new Error(`Could not find the <html> tag`);
	}

	const headMatch = /<\/head>/.exec(html);
	if (!headMatch) {
		throw new Error(`Could not find the </head> ending tag`);
	}

	const ssrMatch = /<!--\s*ssr\s*-->\s*<\/div>/.exec(html);
	if (!ssrMatch) {
		throw new Error(
			`Could not find the <div> with an <!-- ssr --> comment inside`
		);
	}

	const headStart = html
		.substring(htmlMatch.index + htmlMatch[0].length, headMatch.index)
		.trim();

	const bodyStart = html
		.substring(headMatch.index + headMatch[0].length, ssrMatch.index)
		.trim();

	const bodyEnd = html.substring(ssrMatch.index + ssrMatch[0].length).trim();

	return (data: HtmlSsrRenderParams = {}) => {
		// prettier-ignore
		return `<html ${data.htmlAttrs ?? ''}>${headStart}${data.head ?? ''}</head>${bodyStart}${data.app ?? ''}</div>${data.body ?? ''}${bodyEnd}`;
	};
}
