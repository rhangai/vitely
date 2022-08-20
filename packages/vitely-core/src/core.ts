import { AsyncSeriesBailHook, AsyncSeriesHook } from 'tapable';
import { build, createServer as createViteServer, InlineConfig } from 'vite';
import { VitelyHooks } from './hooks';
import { VitelyCoreOptions } from './options';

/**
 * Core class for vitely
 */
export class VitelyCore {
	public readonly hooks: Readonly<VitelyHooks> = {
		config: new AsyncSeriesBailHook(),
		dev: new AsyncSeriesBailHook(),
		build: new AsyncSeriesHook(),
	};

	constructor(private readonly options: VitelyCoreOptions) {}

	/**
	 * Build the project
	 */
	async getViteConfig(): Promise<InlineConfig> {
		const viteConfig: InlineConfig = {};
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
		await this.hooks.build.promise({
			viteConfig,
			options: this.options,
		});
		await build(viteConfig);
	}
}
