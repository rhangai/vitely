import { Suspense } from 'react';
// eslint-disable-next-line import/extensions
import { default as App } from 'virtual:vitely/react/app.tsx';
import { AppContext } from '../hook/app-context.mjs';

export default function Root({ Component, context }: any) {
	return (
		<AppContext.Provider value={context}>
			<Suspense>
				<Component />
				<App />
			</Suspense>
		</AppContext.Provider>
	);
}
