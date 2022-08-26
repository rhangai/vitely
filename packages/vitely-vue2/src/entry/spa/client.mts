import Component from 'virtual:vitely/vue2/app.vue';
import { default as Vue } from 'vue';
import { setupApp } from '../setup-app.mjs';

async function main() {
	const { app, router } = await setupApp(Component);
	router.onReady(() => {
		app.$mount('#app');
	});
}

void main();
