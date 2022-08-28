import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	VitelyConfig,
	VitelyConfigResolved,
	resolveConfigCore,
} from '@vitely/core/plugins';

export type VitelyReactConfigResolved = VitelyConfigResolved & {
	pages: string;
};

export type VitelyReactConfig = VitelyConfig & {
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
		...resolveConfigCore(moduleBase, config),
		pages: config?.pages ?? 'pages',
	};
}
