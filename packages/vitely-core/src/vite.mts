import { VitelyCoreConfig } from './config.mjs';

declare module 'vite' {
	interface UserConfig {
		vitely: VitelyCoreConfig;
	}
}
