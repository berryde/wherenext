import { categories } from '$lib/domain/category';
import { db } from '$lib/services';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const weights = Object.fromEntries(
		Array.from(url.searchParams.entries())
			.filter(([key, _]) => categories.map((c) => c.key).includes(key))
			.map(([key, value]) => [key, parseFloat(value)])
	);
	const limit = parseInt(url.searchParams.get('limit') ?? '100', 10);

	return {
		counties: db.rankCounties(weights, limit)
	};
};
