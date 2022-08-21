import { AsyncSeriesBailHook, AsyncSeriesHook } from 'tapable';
import { build, createServer as createViteServer, InlineConfig } from 'vite';
import { VitelyCoreConfig } from './config.js';
import { VitelyHookConfigViteInlineConfig, VitelyHooks } from './hooks.js';

/**
 * Core class for vitely
 */
export class VitelyCore {
	public readonly hooks: Readonly<VitelyHooks> = {
		config: new AsyncSeriesBailHook(['context']),
		dev: new AsyncSeriesBailHook(['context']),
		build: new AsyncSeriesHook(['context']),
	};

	constructor(private readonly config: VitelyCoreConfig) {}

	/**
	 * Prepare the plugin
	 */
	async setup() {
		const { plugins } = this.config;
		if (plugins) {
			for (const plugin of plugins) {
				await plugin.install({
					hooks: this.hooks,
				});
			}
		}
	}

	/**
	 * Build the project
	 */
	async getViteConfig(): Promise<VitelyHookConfigViteInlineConfig> {
		const viteConfig: VitelyHookConfigViteInlineConfig = {
			root: this.config.root,
			plugins: [],
			build: {},
			server: {},
		};
		await this.hooks.config.promise({
			viteConfig,
			config: this.config,
		});
		return viteConfig;
	}

	/**
	 * Start the dev server
	 */
	async startDevServer() {
		const viteConfig = await this.getViteConfig();
		const vite = await createViteServer(viteConfig);
		const result = await this.hooks.dev.promise({
			vite,
			config: this.config,
		});
		if (!result) {
			const port = this.config.devServer?.port ?? 3000;
			await vite.listen(port);
		} else {
			await result(this.config.devServer ?? {});
		}
	}

	/**
	 * Build the project
	 */
	async build() {
		const viteConfig = await this.getViteConfig();
		const viteConfigs: InlineConfig[] = [viteConfig];
		const addViteConfig = (config: InlineConfig) => {
			viteConfigs.push(config);
		};
		await this.hooks.build.promise({
			viteConfig,
			addViteConfig,
			config: this.config,
		});
		for (const config of viteConfigs) {
			await build(config);
		}
	}
}

/**
 * Create a new vitely core
 */
export async function createVitely(
	config: VitelyCoreConfig
): Promise<VitelyCore> {
	const vitely = new VitelyCore(config);
	await vitely.setup();
	return vitely;
}
