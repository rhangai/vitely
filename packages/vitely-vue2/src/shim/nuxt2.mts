import { computed, getCurrentInstance } from 'vue';

export function useRouter() {
	const vm: any = getCurrentInstance()!;
	return vm.proxy.$router;
}

export function useRoute() {
	const router = useRouter();
	return computed(() => router.currentRoute);
}

export function useStore() {
	const vm: any = getCurrentInstance()!;
	return vm.proxy.$store;
}
