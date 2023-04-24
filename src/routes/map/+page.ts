import { db } from '$lib/services';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const weights = Object.fromEntries(
		Array.from(url.searchParams.entries()).map(([key, value]) => [key, parseFloat(value)])
	);
	return {
		counties: db.rankCounties(weights, 10)
	};
};
