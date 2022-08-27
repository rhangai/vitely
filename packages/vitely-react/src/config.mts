import {
	VitelyConfigPlugin,
	VitelyConfigPluginInput,
	VitelyConfigMiddleware,
	VitelyConfigMiddlewareInput,
	pluginsPluginResolveConfig,
	middlewaresPluginResolveConfig,
} from '@vitely/core/plugins';

export type VitelyReactConfigResolved = {
	ssr: boolean;
	pages: string;
	plugins: VitelyConfigPlugin[];
	middlewares: VitelyConfigMiddleware[];
	standaloneServer: boolean;
};

export type VitelyReactConfig = {
	ssr?: boolean;
	pages?: string;
	plugins?: VitelyConfigPluginInput[];
	middlewares?: VitelyConfigMiddlewareInput[];
	standaloneServer?: boolean;
};

/**
 * Resolve the configuration
 */
export function resolveConfig(
	config: VitelyReactConfig | undefined
): VitelyReactConfigResolved {
	return {
		ssr: !!config?.ssr,
		pages: config?.pages ?? 'pages',
		standaloneServer: !!config?.standaloneServer,
		plugins: pluginsPluginResolveConfig(config?.plugins),
		middlewares: middlewaresPluginResolveConfig(config?.middlewares),
	};
}
