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
	meanTemp: RankedFeature;
	precipitation: RankedFeature;
	tempRange: RankedFeature;
	housing: RankedFeature;
	costOfLiving: RankedFeature;
	startups: RankedFeature;
	ventureCapital: RankedFeature;
	travelConnectivity: RankedFeature;
	commute: RankedFeature;
	businessFreedom: RankedFeature;
	safety: RankedFeature;
	healthcare: RankedFeature;
	education: RankedFeature;
	environmentalQuality: RankedFeature;
	economy: RankedFeature;
	taxation: RankedFeature;
	internetAccess: RankedFeature;
	leisureAndCulture: RankedFeature;
	tolerance: RankedFeature;
	outdoors: RankedFeature;
	humanFreedom: RankedFeature;
	economicFreedom: RankedFeature;
	personalFreedom: RankedFeature;
	population: RankedFeature;
	lat: number;
	lon: number;
	wikidata: string;
};
