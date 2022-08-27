import { createContext, useContext } from 'react';

export type AppContextValue = {
	serverPrefetch: Record<string, Promise<any>>;
};

export const AppContext = createContext<any>({});

export function useAppContext() {
	return useContext(AppContext);
}
