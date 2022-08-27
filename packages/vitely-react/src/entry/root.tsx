// eslint-disable-next-line import/extensions
import { default as App } from 'virtual:vitely/react/app.tsx';
import { AppContext } from '../hook/app-context.mjs';

export default function Root({ context }: any) {
	return (
		<AppContext.Provider value={context}>
			<App />
		</AppContext.Provider>
	);
}
