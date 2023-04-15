export const details: Record<string, FeatureDescription> = {
	meanTemp: {
		label: "Mean Temperature",
		description: "The average annual temperature.",
	},
	precipitation: {
		label: "Precipitation",
		description: "How much precipitation the city gets each year.",
	},
	tempRange: {
		label: "Temperature Range",
		description: "The average annual temperature range.",
	},
	housing: {
		label: "Housing",
		description: "The affordability of housing.",
	},
	costOfLiving: {
		label: "Cost of Living",
		description: "A rating for the cost of living.",
	},
	// startups: {
	// 	label: "Startups",
	// 	description: "How suitable the city is for startups.",
	// },
	// ventureCapital: {
	// 	label: "Venture Capital",
	// 	description: "The amount of venture capital available.",
	// },
	travelConnectivity: {
		label: "Travel Connectivity",
		description: "The ease of travel from the city.",
	},
	// commute: {
	// 	label: "Commute",
	// 	description: "How suitable the city is for commuters.",
	// },
	// businessFreedom: {
	// 	label: "Business Freedom",
	// 	description: "The freedom of businesses to operate in the city.",
	// },
	safety: {
		label: "Safety",
		description: "The safety of the city.",
	},
	healthcare: {
		label: "Healthcare",
		description: "The quality of healthcare.",
	},
	// education: {
	// 	label: "Education",
	// 	description: "The quality of education.",
	// },
	// environmentalQuality: {
	// 	label: "Environmental Quality",
	// 	description: "The quality of the surrounding environment.",
	// },
	// economy: {
	// 	label: "Economy",
	// 	description: "The strength of the economy.",
	// },
	// taxation: {
	// 	label: "Taxation",
	// 	description: "How generous the tax system is.",
	// },
	internetAccess: {
		label: "Internet Access",
		description: "The availability of internet access.",
	},
	leisureAndCulture: {
		label: "Leisure and Culture",
		description: "The quality of leisure and culture.",
	},
	tolerance: {
		label: "Tolerance",
		description:
			"How tolerant the city is to other cultures and different beliefs.",
	},
	outdoors: {
		label: "Outdoors",
		description:
			"The proximity and quality of the outdoors in the surrounding area.",
	},
	// humanFreedom: {
	// 	label: "Human Freedom",
	// 	description: "The human rights of people in the city.",
	// },
	// economicFreedom: {
	// 	label: "Economic Freedom",
	// 	description: "The economic freedom available to each individual.",
	// },
	// personalFreedom: {
	// 	label: "Personal Freedom",
	// 	description: "The freedom of each individual to make their own choices.",
	// },
	population: {
		label: "Population",
		description: "The population of the city.",
	},
};

export type FeatureDescription = {
	label: string;
	description: string;
};

export type RankedFeature = {
	rank: number;
	value: number;
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
};
