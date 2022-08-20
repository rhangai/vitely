import modulesVue3 from './vue3';
import modulesVue2 from './vue2';
import { createVirtualModules } from '../util/virtual-modules';
import { VitelyContext } from '../context';

function getFrameworkModuleMap(ctx: VitelyContext) {
	if (ctx.framework === 'vue2') return modulesVue2(ctx);
	if (ctx.framework === 'vue3') return modulesVue3(ctx);
	throw new Error(`Invalid framework ${ctx.framework}`);
}

export function createFrameworkVirtualModules(ctx: VitelyContext) {
	return createVirtualModules(getFrameworkModuleMap);
}
