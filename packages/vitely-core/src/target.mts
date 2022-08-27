export function vitelyGetTarget() {
	const target = process.env.VITELY_TARGET;
	if (!target) return null;
	if (target.toLowerCase() === 'server') return 'server';
	if (target.toLowerCase() === 'client') return 'client';
	throw new Error(
		`Invalid VITELY_TARGET "${target}". Must be empty, client or server`
	);
}
