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
	rentAffordability: Feature,
	income: Feature,
	employment: Feature,
	education: Feature,
	environment: Feature
});

export type County = z.infer<typeof County>;

export function parseCounty(data: unknown): County {
	return County.parse(data);
}
