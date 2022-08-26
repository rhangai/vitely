import { onMounted, onServerPrefetch, Ref, ref } from 'vue';
import { useSSRContext } from './internals.js';

export type UseFetchResult<T> = [result: Ref<T | null>, loading: Ref<boolean>];

function useFetchSSR<T>(
	key: string,
	cb: () => T | Promise<T>
): UseFetchResult<T> {
	const context = useSSRContext();

	const result: Ref<T | null> = ref(null);
	const loading = ref(true);

	onServerPrefetch(async () => {
		let promise = context.fetchStatePromises[key];
		if (!promise) {
			promise = (async () => {
				const value = await cb();
				context.fetchState[key] = value;
				return value;
			})();
			context.fetchStatePromises[key] = promise;
		}

		const value = await promise;
		result.value = value;
		loading.value = false;
	});

	return [result, loading];
}

function useFetchClient<T>(
	key: string,
	cb: () => T | Promise<T>
): UseFetchResult<T> {
	// eslint-disable-next-line no-underscore-dangle, no-undef
	const fetchState = (window as any)?.__VITELY__?.context?.fetchState;
	const result: Ref<T | null> = ref(null);
	const loading = ref(true);
	if (fetchState && typeof fetchState === 'object' && key in fetchState) {
		result.value = fetchState[key];
		loading.value = false;
		return [result, loading];
	}
	onMounted(async () => {
		result.value = (await cb()) as T;
		loading.value = false;
	});
	return [result, loading];
}

export function useFetch<T>(
	key: string,
	cb: () => T | Promise<T>
): UseFetchResult<T> {
	return import.meta.env.SSR ? useFetchSSR(key, cb) : useFetchClient(key, cb);
}
