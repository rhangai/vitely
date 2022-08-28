type HtmlSsrRenderItem =
	| Array<string | null | undefined>
	| string
	| null
	| undefined;

export type HtmlSsrRenderParams = {
	htmlAttrs?: HtmlSsrRenderItem;
	head?: HtmlSsrRenderItem;
	bodyAttrs?: HtmlSsrRenderItem;
	bodyPrepend?: HtmlSsrRenderItem;
	body?: HtmlSsrRenderItem;
	app?: string;
};

export type HtmlSsrRenderResult = {
	html: string;
};

export type HtmlSsrRender = (
	params: HtmlSsrRenderParams
) => HtmlSsrRenderResult;

/**
 * Simple HTML render
 *
 * The input html must be valid, otherwise, undefined behavior
 */
export async function createHtmlSsrRender(
	htmlParam: string
): Promise<HtmlSsrRender> {
	const htmlInput = htmlParam.trim();

	// Test for <head before <body
	const indexBody = htmlInput.indexOf('<body');
	const indexHead = htmlInput.indexOf('<head');
	if (indexHead < 0) {
		throw new Error(`<head> tag not found`);
	} else if (indexBody < 0) {
		throw new Error(`<body> tag not found`);
	} else if (indexBody < indexHead) {
		throw new Error(`<body> tag must come AFTER <head> tag`);
	}

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

	// Improved search using the already found body index
	const bodyMatch = /^<body(.*?)>/.exec(htmlInput.substring(indexBody));
	if (!bodyMatch) {
		throw new Error(`Could not find the <body> tag`);
	}

	//
	const beforeHtml = htmlInput.substring(0, htmlMatch.index).trim();
	const htmlAttrs = htmlMatch[1].trim();

	const headDefault = htmlInput
		.substring(htmlMatch.index + htmlMatch[0].length, headMatch.index)
		.trim();

	const bodyAttrs = bodyMatch[1].trim();
	const bodyStart = htmlInput
		.substring(indexBody + bodyMatch[0].length, divAppMatch.index)
		.trim();

	const bodyEnd = htmlInput
		.substring(divAppMatch.index + divAppMatch[0].length)
		.trim();

	return (data: HtmlSsrRenderParams = {}) => {
		const renderedHead = toString(data.head);
		const renderedBody = toString(data.body);
		const renderedBodyPrepend = toString(data.bodyPrepend);
		const renderedBodyAttrs = toAttrs(bodyAttrs, data.bodyAttrs);
		const renderedHtmlAttrs = toAttrs(htmlAttrs, data.htmlAttrs);
		const renderedApp = data.app ?? '';

		// prettier-ignore
		const html = `${beforeHtml}<html${renderedHtmlAttrs}>${headDefault}${renderedHead}</head><body${renderedBodyAttrs}>${renderedBodyPrepend}${bodyStart}<div id="app">${renderedApp}</div>${renderedBody}${bodyEnd}`;
		return {
			html,
		};
	};
}

function toAttrs(defaultAttrs: string, attrs: HtmlSsrRenderItem) {
	const renderedAttrs = toString(attrs, ' ');
	if (defaultAttrs) {
		if (renderedAttrs) return ` ${defaultAttrs} ${renderedAttrs}`;
		return ` ${defaultAttrs}`;
	} else if (renderedAttrs) {
		return ` ${renderedAttrs}`;
	}
	return '';
}

function toString(item: HtmlSsrRenderItem, join: string = '') {
	if (item == null) return '';
	if (typeof item === 'string') return item;
	return item.filter(Boolean).join(join);
}
