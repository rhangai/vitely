import faker from '@faker-js/faker';
import { buildRoutesVueRouter } from './build-vue-router';
import { RouteTree } from './tree';

describe('RouteTree', () => {
	const MODULES = {
		'./index.vue': () => ({}),
		'./user/index.vue': () => ({}),
		'./user/:user/index.vue': () => ({}),
		'./user/:user/data.vue': () => ({}),
		'./user/:user/_404.vue': () => ({}),
		'./user/:user/child1/index.vue': () => ({}),
		'./user/:user/child1/data.vue': () => ({}),
		'./user/:user/child2.vue': () => ({}),
		'./user/:user/child2/index.vue': () => ({}),
		'./_404.vue': () => ({}),
	};

	it('should create routes even if out of order', () => {
		const { routes } = buildRoutesVueRouter('./', MODULES);
		console.log(routes);
	});
});
