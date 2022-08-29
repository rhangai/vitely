/// <reference types="vite/client" />
import { Layouts } from 'virtual:vitely/vue2/layouts';
import { computed, defineComponent, getCurrentInstance } from 'vue';
import type { default as VueRouter } from 'vue-router';

export default defineComponent({
	setup() {
		const vm = getCurrentInstance()!;
		const router: VueRouter = (vm.proxy as any).$router;
		const layout = computed(() => {
			const { matched } = router.currentRoute;
			return matched.reduce((previous, item: any) => {
				return item.components?.default?.layout || previous;
			}, 'default');
		});
		return {
			layout,
		};
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
