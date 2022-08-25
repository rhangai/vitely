// @ts-ignore
import { default as devalue } from '@nuxt/devalue';

export function serializeValue(value: unknown): string {
	return devalue(value);
}
