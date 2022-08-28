export type HtmlSsrRenderParams = {
	htmlAttrs?: string;
	head?: Array<string | null | undefined> | string | null | undefined;
	bodyAttrs?: string | null | undefined;
	bodyPrepend?: Array<string | null | undefined> | string | null | undefined;
	body?: Array<string | null | undefined> | string | null | undefined;
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
	const htmlMatch = /<html(.*?)>/.exec(htmlInput);
	if (!htmlMatch) {
		throw new Error(`Could not find the <html> tag`);
	}

	const headMatch = /<\/head>/.exec(htmlInput);
	if (!headMatch) {
		throw new Error(`Could not find the </head> ending tag`);
	}

	// prettier-ignore
	const divAppMatch = /<div\s+id=["']app["']\s*>.*?<\/div>/m.exec(htmlInput);
	if (!divAppMatch) {
		throw new Error(`Could not find empty <div id="app"></div>`);
	}

	const bodyMatch = /<body(.*?)>/.exec(htmlInput);
	if (!bodyMatch) {
		throw new Error(`Could not find the <body> tag`);
	}

	//
	const beforeHtml = htmlInput.substring(0, htmlMatch.index).trim();

	const headDefault = htmlInput
		.substring(htmlMatch.index + htmlMatch[0].length, headMatch.index)
		.trim();

	const bodyAttrs = bodyMatch[1];
	const bodyStart = htmlInput
		.substring(bodyMatch.index + bodyMatch[0].length, divAppMatch.index)
		.trim();

	const bodyEnd = htmlInput
		.substring(divAppMatch.index + divAppMatch[0].length)
		.trim();

	return (data: HtmlSsrRenderParams = {}) => {
		const renderedHead = toString(data.head);
		const renderedBody = toString(data.body);
		const renderedBodyPrepend = toString(data.bodyPrepend);
		const renderedBodyAttrs = toString(data.bodyAttrs, ' ');

		// prettier-ignore
		const html = `${beforeHtml}<html ${data.htmlAttrs ?? ''}>${headDefault}${renderedHead}</head><body ${bodyAttrs} ${renderedBodyAttrs}>${renderedBodyPrepend}${bodyStart}<div id="app">${data.app ?? ''}</div>${renderedBody}${bodyEnd}`;
		return {
			html,
		};
	};
}

function toString(
	item: Array<string | null | undefined> | string | null | undefined,
	join: string = ''
) {
	if (item == null) return '';
	if (typeof item === 'string') return item;
	return item.filter(Boolean).join(join);
}
