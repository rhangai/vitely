import { AsyncSeriesBailHook, AsyncSeriesHook } from 'tapable';
import { build, createServer as createViteServer } from 'vite';
import { VitelyHookConfigViteInlineConfig, VitelyHooks } from './hooks.js';
import { VitelyCoreOptions } from './options.js';

/**
 * Core class for vitely
 */
export class VitelyCore {
	public readonly hooks: Readonly<VitelyHooks> = {
		config: new AsyncSeriesBailHook(['context']),
		dev: new AsyncSeriesBailHook(['context']),
		build: new AsyncSeriesHook(['context']),
	};

	constructor(private readonly options: VitelyCoreOptions) {}

	/**
	 * Prepare the plugin
	 */
	async setup() {
		const { plugins } = this.options;
		if (plugins) {
			for (const plugin of plugins) {
				await plugin({ hooks: this.hooks });
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
		console.log(viteConfig);
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

/**
 * Create a new vitely core
 */
export async function createVitely(
	options: VitelyCoreOptions
): Promise<VitelyCore> {
	const vitely = new VitelyCore(options);
	await vitely.setup();
	return vitely;
}
