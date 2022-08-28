import type { VitelyCoreConfigResolved } from './config.mjs';

export type VitelyCoreOptions = {
	config: VitelyCoreConfigResolved;
	alias: Record<string, string>;
};
