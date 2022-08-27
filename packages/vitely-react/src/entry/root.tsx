import { Suspense } from 'react';
// eslint-disable-next-line import/extensions
import { default as App } from 'virtual:vitely/react/app.tsx';
import { AppContext } from '../hook/app-context.mjs';
import { createRouter } from '../router/runtime/create-router.mjs';

export default function Root({ context, url }: any) {
	const { Routes } = createRouter(url ?? '/');
	return (
		<AppContext.Provider value={context}>
			<Suspense>
				<App>
					<Routes />
				</App>
			</Suspense>
		</AppContext.Provider>
	);
}
