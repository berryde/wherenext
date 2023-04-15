import { writable, get } from 'svelte/store';
import type { City, FeatureDescription } from './types';

export const API_URL = 'http://127.0.0.1:8000';
const descriptions = writable<Record<string, FeatureDescription>>();

export const getFeatures = async (): Promise<Record<string, FeatureDescription>> => {
	const response = await fetch(`${API_URL}/features`);
	descriptions.set(await response.json());
	return get(descriptions);
};

export const getDescription = async (key: string): Promise<FeatureDescription> => {
	if (!get(descriptions)) {
		await getFeatures();
	}
	if (key in get(descriptions)) {
		return get(descriptions)[key];
	}
	return {
		label: key,
		description: 'There is no description for this feature.'
	};
};

export const getCity = async (id: string): Promise<City> => {
	const response = await fetch(`${API_URL}/cities/${id}`);
	return await response.json();
};

export const getSimilar = async (id: string): Promise<City[]> => {
	const response = await fetch(`${API_URL}/cities/${id}/similar?limit=5`);
	return await response.json();
};
