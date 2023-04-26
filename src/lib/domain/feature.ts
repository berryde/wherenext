import * as z from 'zod';
import { percentile, positiveInteger } from './schema';

export const Feature = z.object({
	name: z.string(),
	value: z.number(),
	rank: positiveInteger('Rank must be greater than zero'),
	percentile: percentile
});

export type Feature = z.infer<typeof Feature>;

export function parseFeature(data: unknown): Feature {
	return Feature.parse(data);
}
