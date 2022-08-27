import { createElement, ReactNode } from 'react';
import {
	Route,
	Routes as ReactRouterRoutes,
	RouteProps,
} from 'react-router-dom';
import {
	pagesModules,
	pagesRoot,
	Router,
} from 'virtual:vitely/react/router-data';
import { buildRoutesReactRouter } from './build-routes.mjs';

const { routes } = buildRoutesReactRouter(pagesRoot, pagesModules);

type RouteData = RouteProps & { children?: RouteData[] };

export function createRouter(url: string) {
	const mapRoute = (route: RouteData): ReactNode => {
		const { children, ...props } = route;
		const childrenNodes = children?.map((item) => mapRoute(item)) ?? [];
		return createElement(Route, props, ...childrenNodes);
	};

	const routeElements = routes.map(mapRoute);
	const Routes = () => {
		const routesElement = createElement(
			ReactRouterRoutes,
			{},
			...routeElements
		);
		return createElement(Router as any, { location: url }, routesElement);
	};
	return {
		Routes,
	};
}
