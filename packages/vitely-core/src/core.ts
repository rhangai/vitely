import { AsyncSeriesBailHook, AsyncSeriesHook } from 'tapable';
import {
	build as viteBuild,
	createServer as viteCreateServer,
	InlineConfig as ViteInlineConfig,
	ResolvedConfig as ViteResolvedConfig,
	resolveConfig as viteResolveConfig,
	// @ts-ignore
} from 'vite';
import { VitelyCoreConfigResolved } from './config.js';
import { VitelyHooks, VitelyHookViteConfig } from './hooks.js';

/**
 * Core class for vitely
 */
export class VitelyCore {
	public readonly hooks: Readonly<VitelyHooks> = {
		config: new AsyncSeriesBailHook(['context']),
		dev: new AsyncSeriesBailHook(['context']),
		build: new AsyncSeriesHook(['context']),
	};

	private readonly config: VitelyCoreConfigResolved;

	constructor(private readonly viteConfig: ViteResolvedConfig) {
		this.config = {
			ssr: true,
			plugins: [],
			...(viteConfig as any).vitely,
		};
	}

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
	async getViteConfig(): Promise<VitelyHookViteConfig> {
		const viteConfig: VitelyHookViteConfig = {
			...this.viteConfig.inlineConfig,
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
		const vite = await viteCreateServer({
			...viteConfig,
			configFile: false,
			assetsInclude: [],
		});
		const result = await this.hooks.dev.promise({
			vite,
			config: this.config,
		});
		if (!result) {
			const port = viteConfig.server.port ?? 3000;
			await vite.listen(port);
		} else {
			await result(viteConfig);
		}
	}

	/**
	 * Build the project
	 */
	async build() {
		const viteConfig = await this.getViteConfig();
		const viteConfigs: ViteInlineConfig[] = [viteConfig];
		const addViteConfig = (config: ViteInlineConfig) => {
			viteConfigs.push({ ...config });
		};
		await this.hooks.build.promise({
			viteConfig,
			addViteConfig,
			config: this.config,
		});
		for (const config of viteConfigs) {
			await viteBuild(config);
		}
	}
}

/**
 * Create a new vitely core
 */
export async function vitelyBuild(
	configParam: ViteInlineConfig
): Promise<void> {
	const viteConfig = await viteResolveConfig(configParam, 'build');
	console.log(viteConfig);
	const vitely = new VitelyCore(viteConfig);
	await vitely.setup();
	await vitely.build();
}

/**
 * Create a new vitely core
 */
export async function vitelyDevServer(
	configParam: ViteInlineConfig
): Promise<void> {
	const viteConfig = await viteResolveConfig(configParam, 'serve');
	const vitely = new VitelyCore(viteConfig);
	await vitely.setup();
	await vitely.startDevServer();
}
