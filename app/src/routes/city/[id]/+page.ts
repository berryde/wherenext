import { getCity, getSimilar } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ route, params }) => {
	const id = params.id;
	const city = await getCity(id);
	const similar = await getSimilar(id);
	return {
		city,
		similar
	};
};
