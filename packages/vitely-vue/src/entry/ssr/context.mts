export type SSRContext = {
	fetchState: Record<string, any>;
	store: Record<string, any> | undefined;
};
