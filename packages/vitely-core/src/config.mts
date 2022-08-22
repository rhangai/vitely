import type { VitelyHooks } from './hooks.mjs';

export type VitelyContext = {
	hooks: VitelyHooks;
};

export type VitelyModule = {
	install(ctx: VitelyContext): void | Promise<void>;
};

export type VitelyCoreConfig = {
	ssr?: boolean;
	modules?: VitelyModule[];
};

export type VitelyCoreConfigResolved = {
	root: string;
	outDir: string;
	ssr: boolean;
	modules: VitelyModule[];
};

/**
 * Define vitely configuration
 */
export function defineVitely(input: VitelyCoreConfig): VitelyCoreConfig {
	return input;
}
