import { VitelyFramework } from './config';

export type VitelyContext = {
	framework: VitelyFramework;
	ssr: boolean;
	srcDir: string;
	mainModule: string;
};
