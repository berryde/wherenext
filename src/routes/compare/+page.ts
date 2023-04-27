import type { PageLoad } from './$types';
import { db } from '$lib/services';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ url }) => {
	// get left from query params
	const left = url.searchParams.get('left');
	const right = url.searchParams.get('right');

	return {
		left: left ? db.getCounty(left) : undefined,
		right: right ? db.getCounty(right) : undefined
	};
};
