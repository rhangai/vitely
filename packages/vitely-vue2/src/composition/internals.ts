import { getCurrentInstance, InjectionKey } from 'vue';

export function useSSRContext() {
	const vm = getCurrentInstance();
	const context = vm!.proxy.$ssrContext;
	if (!import.meta.env.SSR || !context) {
		throw new Error(`Must be called from an ssr`);
	}
	return context;
}
