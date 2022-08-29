import { VueConstructor } from 'vue';
import { default as LayoutManager } from './layout-manager.js';

export default {
	install(vue: VueConstructor) {
		vue.component('layout-manager', LayoutManager);
	},
};
