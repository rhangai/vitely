import type { AsyncSeriesHook, AsyncSeriesBailHook } from 'tapable';
// @ts-ignore
import type { InlineConfig as ViteInlineConfig, ViteDevServer } from 'vite';
import type { VitelyCoreConfigResolved } from './config.mjs';

type MarkRequired<T, RK extends keyof T> = Omit<T, RK> & Required<Pick<T, RK>>;

// prettier-ignore
export type VitelyHookViteConfig = MarkRequired<ViteInlineConfig, 'plugins' | 'server' | 'build'>

/**
 * Config hook context
 */
type VitelyHookConfigContext = {
	config: VitelyCoreConfigResolved;
	viteConfig: VitelyHookViteConfig;
};

/**
 * Dev hook context
 */
type VitelyHookDevContext = {
	config: VitelyCoreConfigResolved;
	vite: ViteDevServer;
};

/**
 * Dev result
 */
// prettier-ignore
type VitelyHookDevResult = (viteConfig: VitelyHookViteConfig) => void | Promise<void>;

/**
 * Build hook context
 */
type VitelyHookBuildContext = {
	config: VitelyCoreConfigResolved;
	viteConfig: VitelyHookViteConfig;
	addViteConfig: (config: ViteInlineConfig) => void;
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