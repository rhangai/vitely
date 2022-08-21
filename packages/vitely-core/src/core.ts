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

	constructor(private readonly options: VitelyCoreConfig) {}

	/**
	 * Prepare the plugin
	 */
	async setup() {
		const { plugins } = this.options;
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
			root: this.options.root,
			plugins: [],
			build: {},
			server: {},
		};
		await this.hooks.config.promise({
			viteConfig,
			options: this.options,
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
			options: this.options,
		});
		if (!result) {
			const port = this.options.devServer?.port ?? 3000;
			await vite.listen(port);
		} else {
			await result(this.options.devServer ?? {});
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
			options: this.options,
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
	options: VitelyCoreConfig
): Promise<VitelyCore> {
	const vitely = new VitelyCore(options);
	await vitely.setup();
	return vitely;
}
