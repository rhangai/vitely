/// <reference types="vite/client" />
import { Layouts } from 'virtual:vitely/vue2/layouts';
import { defineComponent } from 'vue';
import type { default as VueRouter } from 'vue-router';

export default defineComponent({
	computed: {
		layout() {
			const router: VueRouter = (this as any).$router;
			const { matched } = router.currentRoute;
			return matched.reduce((previous, item: any) => {
				return item.components?.default?.layout || previous;
			}, 'default');
		},
	},
	render(h) {
		const component = Layouts[this.layout] ?? Layouts.default;
		if (!component) {
			// eslint-disable-next-line no-console
			console.warn(`Layout not found ${this.layout}`);
			return h('div', {}, this.$slots.default);
		}
		return h(component, {}, this.$slots.default);
	},
});
