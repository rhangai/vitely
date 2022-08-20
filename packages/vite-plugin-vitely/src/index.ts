import { Plugin } from 'vite';
import { VitelyConfig } from './config';
import { VitelyContext } from './context';
import { createFrameworkVirtualModules } from './frameworks';

export default function vitePluginVitely(config: VitelyConfig): Plugin {
	const context: VitelyContext = {
		...config,
		ssr: false,
		srcDir: config.srcDir ?? './',
		mainModule: '@@main',
	};
	const { setup, resolveId, load } = createFrameworkVirtualModules(context);
	return {
		name: 'vitely',
		resolveId,
		load,
		config: (config) => {
			context.ssr = !!config.build?.ssr;
			setup(context);
			if (!context.ssr) return;
			return {
				build: {
					rollupOptions: {
						external(module) {
							if (['http', 'querystring'].includes(module))
								return false;
							return false;
						},
					},
				},
			};
		},
		transformIndexHtml: {
			enforce: 'pre',
			transform() {
				return [
					{
						tag: 'script',
						attrs: {
							type: 'module',
							src: `/${context.mainModule}`,
						},
						injectTo: 'body',
					},
				];
			},
		},
	};
}
