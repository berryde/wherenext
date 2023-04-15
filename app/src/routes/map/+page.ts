import type { PageLoad } from './$types';
import { API_URL } from '$lib/api';
import type { City } from '$lib/types';

export const load: PageLoad = async ({ url, fetch }) => {
	const response = await fetch(`${API_URL}/cities?${url.searchParams.toString()}`);
	const cities = (await response.json()) as City[];
	const wanted = url.searchParams.getAll('wanted');
	const unwanted = url.searchParams.getAll('unwanted');
	return {
		cities,
		wanted,
		unwanted
	};
};
