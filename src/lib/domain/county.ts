import * as z from 'zod';
import { Feature } from './feature';
import { fipsCode, latitude, longitude, positiveInteger } from './schema';

const County = z.object({
	fipsCode: fipsCode,
	county: z.string(),
	state: z.string(),
	lat: latitude,
	lng: longitude,
	population: positiveInteger('Population must be greater than zero'),
	features: z.record(Feature)
});

export type County = z.infer<typeof County>;

export function parseCounty(data: unknown): County {
	return County.parse(data);
}
