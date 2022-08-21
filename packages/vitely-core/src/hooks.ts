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
	viteConfig: VitelyHookConfigViteInlineConfig;
	options: VitelyCoreConfig;
};

/**
 * Dev hook context
 */
type VitelyHookDevContext = {
	vite: ViteDevServer;
	options: VitelyCoreConfig;
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
	viteConfig: VitelyHookConfigViteInlineConfig;
	addViteConfig: (config: InlineConfig) => void;
	options: VitelyCoreConfig;
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
