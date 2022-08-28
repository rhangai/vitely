import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	VitelyCoreConfig,
	VitelyCoreConfigResolved,
	resolveCoreConfig,
} from '@vitely/core/plugins';

export type VitelyReactConfigResolved = VitelyCoreConfigResolved & {
	pages: string;
};

export type VitelyReactConfig = VitelyCoreConfig & {
	pages?: string;
};

/**
 * Resolve the configuration
 */
export function resolveConfig(
	config: VitelyReactConfig | undefined
): VitelyReactConfigResolved {
	const moduleBase = dirname(fileURLToPath(import.meta.url));
	return {
		...resolveCoreConfig(moduleBase, config),
		pages: config?.pages ?? 'pages',
	};
}
