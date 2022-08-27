import { createContext, useContext } from 'react';

export type AppContextValue = {
	serverPrefetch: Record<string, Promise<any>>;
	serverPrefetchState: Record<string, unknown>;
};

export const AppContext = createContext<AppContextValue>({
	serverPrefetch: {},
	serverPrefetchState: {},
});

export function useAppContext() {
	return useContext(AppContext);
}
