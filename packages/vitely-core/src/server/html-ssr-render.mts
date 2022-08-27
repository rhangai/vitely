export type HtmlSsrRenderParams = {
	htmlAttrs?: string;
	head?: string;
	body?: string;
	app?: string;
};

export type HtmlSsrRenderResult = {
	html: string;
};

export type HtmlSsrRender = (
	params: HtmlSsrRenderParams
) => HtmlSsrRenderResult;

/**
 * Create the html renderer
 */
export async function createHtmlSsrRender(
	htmlParam: string
): Promise<HtmlSsrRender> {
	const htmlInput = htmlParam.trim();
	const htmlMatch = /^<html(.*?)>/.exec(htmlInput);
	if (!htmlMatch) {
		throw new Error(`Could not find the <html> tag`);
	}

	const headMatch = /<\/head>/.exec(htmlInput);
	if (!headMatch) {
		throw new Error(`Could not find the </head> ending tag`);
	}

	const ssrMatch = /<!--\s*ssr\s*-->\s*<\/div>/.exec(htmlInput);
	if (!ssrMatch) {
		throw new Error(
			`Could not find the <div> with an <!-- ssr --> comment inside`
		);
	}

	const headStart = htmlInput
		.substring(htmlMatch.index + htmlMatch[0].length, headMatch.index)
		.trim();

	const bodyStart = htmlInput
		.substring(headMatch.index + headMatch[0].length, ssrMatch.index)
		.trim();

	const bodyEnd = htmlInput
		.substring(ssrMatch.index + ssrMatch[0].length)
		.trim();

	return (data: HtmlSsrRenderParams = {}) => {
		// prettier-ignore
		const html = `<html ${data.htmlAttrs ?? ''}>${headStart}${data.head ?? ''}</head>${bodyStart}${data.app ?? ''}</div>${data.body ?? ''}${bodyEnd}`;
		return {
			html,
		};
	};
}
