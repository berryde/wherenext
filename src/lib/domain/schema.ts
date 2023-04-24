import * as z from 'zod';

export const positiveInteger = (error: string) => z.number().int().min(1, { message: error });
export const percentile = z
	.number()
	.min(0, { message: 'Percentile must be greater than zero' })
	.max(100, { message: 'Percentile must be less than 100' });

export const fipsCode = z.string().length(5, { message: 'FIPS code must be 5 characters' });

export const latitude = z
	.number()
	.min(-90, { message: 'Latitude must be between -90 and 90' })
	.max(90, { message: 'Latitude must be between -90 and 90' });

export const longitude = z
	.number()
	.min(-180, { message: 'Longitude must be between -180 and 180' })
	.max(180, { message: 'Longitude must be between -180 and 180' });
