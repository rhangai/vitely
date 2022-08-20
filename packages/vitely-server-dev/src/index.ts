import { createServer } from 'vite';
import fastify from 'fastify';
import middie from '@fastify/middie';

async function main() {
	const vite = await createServer({
		configFile: false,
		appType: 'custom',
		server: {
			middlewareMode: true,
		},
	});
	const app = fastify();
	await app.register(middie);
	app.use(vite.middlewares);
	await app.listen({
		port: 3000,
	});
}

main();
