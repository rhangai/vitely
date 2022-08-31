import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
// eslint-disable-next-line import/extensions
import { default as App } from 'virtual:vitely/react/app.tsx';
import { AppContext } from '../../hook/app-context.mjs';
import { createRouter } from '../../runtime/router/create-router.mjs';

export default function Root({ context, url, helmetContext }: any) {
	const { Routes } = createRouter(url ?? '/');
	return (
		<AppContext.Provider value={context}>
			<HelmetProvider context={helmetContext}>
				<Suspense>
					<App>
						<Routes />
					</App>
				</Suspense>
			</HelmetProvider>
		</AppContext.Provider>
	);
}
