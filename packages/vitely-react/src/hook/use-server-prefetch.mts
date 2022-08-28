import { useState } from 'react';
import { useAppContext } from './app-context.mjs';

export function useServerPrefetch<T>(
	key: string,
	fetch: () => Promise<T> | T,
	onValue: (value: T) => void
): void {
	const context = useAppContext();
	if (!import.meta.env.SSR) {
		console.warn(`Using serverPrefetch without SSR context`);
	}
	if (context.serverPrefetchState[key]) {
		onValue(context.serverPrefetchState[key] as T);
		return;
	}
	if (!context.serverPrefetch[key]) {
		if (!context.serverPrefetchEnabled) {
			console.warn(`Option 'serverPrefetch' not enabled`);
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
	const context = useAppContext();
	return useState<T>(() => (context.serverPrefetchState[key] as any) ?? null);
}
