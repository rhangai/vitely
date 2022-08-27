import { useEffect, useState } from 'react';
import {
	useServerPrefetch,
	useServerPrefetchState,
} from './use-server-prefetch.mjs';

function useFetchServer<T>(
	key: string,
	fetch: () => Promise<T> | T
): [T | null, boolean] {
	let result = null;
	let loading = true;
	useServerPrefetch(key, fetch, (value) => {
		result = value;
		loading = false;
	});
	return [result, loading];
}

function useFetchClient<T>(
	key: string,
	fetch: () => Promise<T> | T
): [T | null, boolean] {
	const [result, setResult] = useServerPrefetchState<T | null>(key);
	const [loading, setLoading] = useState(result == null);
	useEffect(() => {
		if (result) return;
		void (async () => {
			const value = await fetch();
			setResult(value);
			setLoading(false);
		})();
	}, []);
	return [result, loading];
}

export function useFetch<T>(
	key: string,
	fetch: () => Promise<T> | T
): [T | null, boolean] {
	return import.meta.env.SSR
		? useFetchServer(key, fetch)
		: useFetchClient(key, fetch);
}
