import type { AsyncSeriesHook, AsyncSeriesBailHook } from 'tapable';
import { InlineConfig, type ViteDevServer } from 'vite';
import type { VitelyCoreDevServerConfig, VitelyCoreConfig } from './config.js';

type MarkRequired<T, RK extends keyof T> = Omit<T, RK> & Required<Pick<T, RK>>;

// prettier-ignore
export type VitelyHookConfigViteInlineConfig = MarkRequired<InlineConfig, 'plugins' | 'root' | 'server' | 'build'>

/**
 * Config hook context
 */
type VitelyHookConfigContext = {
	config: VitelyCoreConfig;
	viteConfig: VitelyHookConfigViteInlineConfig;
};

/**
 * Dev hook context
 */
type VitelyHookDevContext = {
	config: VitelyCoreConfig;
	vite: ViteDevServer;
};

/**
 * Dev result
 */
// prettier-ignore
type VitelyHookDevResult = (devServerConfig: VitelyCoreDevServerConfig) => void | Promise<void>;

/**
 * Build hook context
 */
type VitelyHookBuildContext = {
	config: VitelyCoreConfig;
	viteConfig: VitelyHookConfigViteInlineConfig;
	addViteConfig: (config: InlineConfig) => void;
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
