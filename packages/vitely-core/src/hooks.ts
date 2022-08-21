import type { AsyncSeriesHook, AsyncSeriesBailHook } from 'tapable';
import { InlineConfig as ViteInlineConfig, type ViteDevServer } from 'vite';
import type { VitelyCoreConfigResolved } from './config.js';

type MarkRequired<T, RK extends keyof T> = Omit<T, RK> & Required<Pick<T, RK>>;

// prettier-ignore
export type VitelyHookViteConfig = MarkRequired<ViteInlineConfig, 'plugins' | 'root' | 'server' | 'build'>

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
