import type { VitelyHooks } from './hooks.js';

export type VitelyPluginContext = {
	hooks: VitelyHooks;
};

export type VitelyPlugin = {
	install(ctx: VitelyPluginContext): void | Promise<void>;
};
