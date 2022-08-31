export function getVitelyRuntimeContext<T>(): T | undefined {
	// eslint-disable-next-line no-underscore-dangle, no-undef
	return (window as any)?.__VITELY__?.context;
}
