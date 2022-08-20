type VitelyCoreOptions = {};

/**
 * Core class for vitely
 */
export class VitelyCore<TOptions extends VitelyCoreOptions> {
	constructor(private readonly options: TOptions) {}
}
