import type { PageLoad } from './$types';
import { db } from '$lib/services';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	const { fips } = params;
	const county = db.getCounty(fips);
	if (!county) throw error(404, 'County not found');
	return {
		county
	};
};
