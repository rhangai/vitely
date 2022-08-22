import { AsyncSeriesBailHook, AsyncSeriesHook } from 'tapable';
import {
	build as viteBuild,
	createServer as viteCreateServer,
	InlineConfig as ViteInlineConfig,
	ResolvedConfig as ViteResolvedConfig,
	resolveConfig as viteResolveConfig,
	// @ts-ignore
} from 'vite';
import { VitelyCoreConfig, VitelyCoreConfigResolved } from './config.mjs';
import { VitelyHooks, VitelyHookViteConfig } from './hooks.mjs';

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

	constructor(private readonly viteConfigResolved: ViteResolvedConfig) {
		const vitelyConfig: VitelyCoreConfig = (viteConfigResolved as any)
			.vitely;
		this.config = {
			ssr: true,
			modules: [],
			...vitelyConfig,
			root: viteConfigResolved.root,
			outDir: viteConfigResolved.build.outDir,
		};
	}

	/**
	 * Prepare the plugin
	 */
	async setup() {
		const { modules } = this.config;
		if (modules) {
			for (const vitelyModule of modules) {
				await vitelyModule.install({
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
			...this.viteConfigResolved.inlineConfig,
			plugins: [],
			build: {},
			server: {
				port: 3000,
			},
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
		const vite = await viteCreateServer(viteConfig);
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
