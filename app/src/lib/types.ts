export type RankedFeature = {
	rank: number;
	value: number;
};

export type FeatureDescription = {
	label: string;
	description: string;
};

export type City = {
	id: string;
	name: string;
	country: string;
	features: {
		[key: string]: RankedFeature;
	};
	lat: number;
	lon: number;
	wikidata: string;
	score?: number;
};
