import { useAppContext } from './app-context.mjs';

export function useServerPrefetch<T>(
	key: string,
	fetch: () => Promise<T> | T
): Promise<T> {
	const context = useAppContext();
	if (!context.serverPrefetch[key]) {
		context.serverPrefetch[key] = fetch();
	}
	return context.serverPrefetch[key];
}
