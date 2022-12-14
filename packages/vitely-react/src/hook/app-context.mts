import type { VitelyLogger } from '@vitely/core';
import { createContext, useContext } from 'react';

export type AppContextValue = {
	logger: VitelyLogger;
	serverPrefetchEnabled?: boolean;
	serverPrefetch: Record<string, Promise<any>>;
	serverPrefetchState: Record<string, unknown>;
};

export const VitelyAppContext = createContext<AppContextValue>({
	logger: console,
	serverPrefetch: {},
	serverPrefetchState: {},
});

export function useVitelyContext() {
	return useContext(VitelyAppContext);
}
