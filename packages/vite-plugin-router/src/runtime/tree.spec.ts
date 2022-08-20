import { RouteTree } from './tree';
import faker from '@faker-js/faker';

describe('RouteTree', () => {
	const FILES = [
		'./index.vue',
		'./user/index.vue',
		'./user/:user/index.vue',
		'./user/:user/data.vue',
		'./user/:user/_404.vue',
		'./user/:user/child1/index.vue',
		'./user/:user/child1/data.vue',
		'./user/:user/child2.vue',
		'./user/:user/child2/index.vue',
		'./_404.vue',
	];
	const ROUTES = [
		{
			relativeKey: [],
			fullKey: [],
			value: './index.vue',
			isIndex: true,
		},
		{
			relativeKey: ['user'],
			fullKey: ['user'],
			value: './user/index.vue',
			isIndex: true,
		},
		{
			relativeKey: ['user', ':user'],
			fullKey: ['user', ':user'],
			value: './user/:user/index.vue',
			isIndex: true,
		},
		{
			relativeKey: ['user', ':user', 'child1'],
			fullKey: ['user', ':user', 'child1'],
			value: './user/:user/child1/index.vue',
			isIndex: true,
		},
		{
			relativeKey: ['user', ':user', 'child1', 'data'],
			fullKey: ['user', ':user', 'child1', 'data'],
			value: './user/:user/child1/data.vue',
		},
		{
			relativeKey: ['user', ':user', 'child2'],
			fullKey: ['user', ':user', 'child2'],
			value: './user/:user/child2.vue',
			children: [
				{
					relativeKey: [],
					fullKey: ['user', ':user', 'child2'],
					value: './user/:user/child2/index.vue',
					isIndex: true,
				},
			],
		},
		{
			relativeKey: ['user', ':user', 'data'],
			fullKey: ['user', ':user', 'data'],
			value: './user/:user/data.vue',
		},
		{
			relativeKey: ['user', ':user'],
			fullKey: ['user', ':user'],
			value: './user/:user/_404.vue',
			isWildcard: true,
		},
		{
			relativeKey: [],
			fullKey: [],
			value: './_404.vue',
			isWildcard: true,
		},
	];

	it('should create routes', () => {
		const tree = new RouteTree();
		FILES.forEach((file) => {
			tree.add(file.substring(2), file);
		});
		// console.log(JSON.stringify(tree.build(), null, 2));
		expect(tree.build()).toMatchObject(ROUTES);
	});

	it('should create routes even if out of order', () => {
		const tree = new RouteTree();
		const files = faker.helpers.shuffle(FILES);
		files.forEach((file) => {
			tree.add(file.substring(2), file);
		});
		expect(tree.build()).toMatchObject(ROUTES);
	});
});
