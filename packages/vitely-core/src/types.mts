export type VitelyLogger = {
	warn(something: any): void;
	error(something: any): void;
	info(something: any): void;
};

// prettier-ignore
/**
 * Plugin configuration
 */
export type VitelyCorePlugin<TContext> = (context: TContext) => void | Promise<void>;

/**
 * Plugin options
 */
export type VitelyCoreSetupPluginsOptions<TContext> = {
	context: TContext;
};

// prettier-ignore
/**
 * Middleware for vitely
 */
export type VitelyCoreMiddleware<TContext> = (context: TContext) => void | Promise<void>;

/**
 * Middleware options
 */
export type VitelyCoreRunMiddlewaresOptions<TContext> = {
	context: TContext;
	routeChanged(): boolean;
};
