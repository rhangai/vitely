import { useState } from 'react';
import { useVitelyContext } from './app-context.mjs';

export function useServerPrefetch<T>(
	key: string,
	fetch: () => Promise<T> | T,
	onValue: (value: T) => void
): void {
	const context = useVitelyContext();
	if (!import.meta.env.SSR) {
		context.logger.warn(`Using serverPrefetch without SSR context`);
	}
	if (context.serverPrefetchState[key]) {
		onValue(context.serverPrefetchState[key] as T);
		return;
	}
	if (!context.serverPrefetch[key]) {
		if (!context.serverPrefetchEnabled) {
			context.logger.warn(`Option 'serverPrefetch' not enabled`);
		}
		context.serverPrefetch[key] = Promise.resolve(fetch());
		void context.serverPrefetch[key].then((value) => {
			context.serverPrefetchState[key] = value;
			onValue(value);
		});
	}
	void context.serverPrefetch[key].then((value) => {
		onValue(value);
	});
}

export function useServerPrefetchState<T>(key: string) {
	const context = useVitelyContext();
	return useState<T>(() => (context.serverPrefetchState[key] as any) ?? null);
}
