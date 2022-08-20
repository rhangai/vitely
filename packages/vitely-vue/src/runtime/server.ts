import fastify from 'fastify';

async function main() {
	const app = fastify();
	app.get('/', async (req, res) => {
		try {
			await res.type('text/html').send('<div>Ok</div>');
		} catch (e: any) {
			await res.status(500).send({});
		}
	});
	await app.listen({
		port: 3000,
	});
}

void main();
