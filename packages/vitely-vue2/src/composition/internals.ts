import { inject, InjectionKey } from 'vue';

export const SSR_CONTEXT_KEY: InjectionKey<Record<string, any>> = Symbol('SSR');

export function useSSRContext() {
	const context = inject(SSR_CONTEXT_KEY, null) as any;
	if (!import.meta.env.SSR || !context) {
		throw new Error(`Must be called from an ssr`);
	}
	return context;
}
