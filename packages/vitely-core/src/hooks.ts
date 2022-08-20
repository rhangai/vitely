import { type AsyncSeriesHook, type AsyncSeriesBailHook } from 'tapable';
import { InlineConfig, type ViteDevServer } from 'vite';
import {
	VitelyCoreDevServerOptions,
	type VitelyCoreOptions,
} from './options.js';

type MarkRequired<T, RK extends keyof T> = Omit<T, RK> & Required<Pick<T, RK>>;

// prettier-ignore
export type VitelyHookConfigViteInlineConfig = MarkRequired<InlineConfig, 'plugins' | 'root' | 'server' | 'build'>

/**
 * Config hook context
 */
type VitelyHookConfigContext = {
	viteConfig: VitelyHookConfigViteInlineConfig;
	options: VitelyCoreOptions;
};

/**
 * Dev hook context
 */
type VitelyHookDevContext = {
	vite: ViteDevServer;
	options: VitelyCoreOptions;
};

/**
 * Dev result
 */
// prettier-ignore
type VitelyHookDevResult = (devServerOptions: VitelyCoreDevServerOptions) => void | Promise<void>;

/**
 * Build hook context
 */
type VitelyHookBuildContext = {
	viteConfig: VitelyHookConfigViteInlineConfig;
	addViteConfig: (config: InlineConfig) => void;
	options: VitelyCoreOptions;
};

export type VitelyHooks = {
	/**
	 * Config hook
	 *
	 * Default configure vite
	 */
	config: AsyncSeriesHook<[VitelyHookConfigContext], void>;
	dev: AsyncSeriesBailHook<[VitelyHookDevContext], VitelyHookDevResult>;
	build: AsyncSeriesHook<[VitelyHookBuildContext], void>;
};
