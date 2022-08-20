import { renderToString } from 'vue/server-renderer';
import { Component, createSSRApp } from 'vue';

type RenderOptions = {
	component: Component;
};

export async function render({ component }: RenderOptions) {
	const app = createSSRApp(component);
	// passing SSR context object which will be available via useSSRContext()
	// @vitejs/plugin-vue injects code into a component's setup() that registers
	// itself on ctx.modules. After the render, ctx.modules would contain all the
	// components that have been instantiated during this render call.
	const ctx = {};
	const html = await renderToString(app, ctx);
	console.log(ctx);
	return html;
}
