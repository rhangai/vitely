import type { VitelyHooks } from './hooks.mjs';

export type VitelyPluginContext = {
	hooks: VitelyHooks;
};

export type VitelyPlugin = {
	install(ctx: VitelyPluginContext): void | Promise<void>;
};
