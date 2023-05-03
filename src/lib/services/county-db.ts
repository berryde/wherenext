import type { County } from '../domain/county';
import dataset from '$lib/assets/dataset.json';
import { categories } from '$lib/domain/category';
import type { Feature } from '$lib/domain/feature';

export default class CountyDB {
	private counties: County[];

	constructor() {
		this.counties = dataset as County[];
	}

	/**
	 * Retrieves all counties in the database.
	 * @returns A list of all counties in the database.
	 */
	getCounties(): County[] {
		return this.counties;
	}

	/**
	 * Retrieves a county by its FIPS code.
	 * @param fipsCode The FIPS code of the county to retrieve
	 * @returns The county with the given FIPS code or undefined if no county with that code exists.
	 */
	getCounty(fipsCode: string): County | undefined {
		return this.counties.find((county) => county['FIPS Code'] === fipsCode);
	}

	getCountyByNameAndState(name: string): County | undefined {
		return this.counties.find((county) => county['County, State'] === name);
	}

	/**
	 * Normalise a rank to be in the range (-1, 1) inclusive. A high rank is bad.
	 * @param rank The rank to normalise.
	 * @returns The normalised rank.
	 */
	private normaliseRank(feature: string, rank: number): number {
		const category = categories.find((c) => c.key === feature);
		if (!category) return 0;
		const mid = category.max - category.min / 2;
		return -1 * ((rank - mid) / mid);
	}

	/**
	 * Normalise the criteria weights to be in the range (-1, 1) inclusive.
	 * @param criteria The criteria to normalise.
	 * @param mid The middle value of the range to normalise to.
	 * @returns The normalised criteria.
	 */
	private normaliseCriteria(
		criteria: Partial<Record<keyof County, number>>,
		mid: number
	): Partial<Record<keyof County, number>> {
		if (Object.values(criteria).every((v) => v == mid)) {
			return Object.fromEntries(Object.keys(criteria).map((key) => [key, 1]));
		}
		return Object.fromEntries(
			Object.entries(criteria).map(([key, value]) => {
				return [key, (value - mid) / mid];
			})
		);
	}

	/**
	 * Scores a county based on the given criteria.
	 * @param county The county to score
	 * @param criteria A set of weights for each feature as a value between 0 and 10 inclusive.
	 * @returns The score for the county
	 */
	private getScore(county: County, criteria: Partial<Record<keyof County, number>>): number {
		if (!criteria || Object.keys(criteria).length === 0) {
			criteria = Object.fromEntries(Object.keys(county.features).map((key) => [key, 5]));
		}

		const max = 10;
		const min = 0;
		const mid = (max - min) / 2;

		const normalisedCriteria = this.normaliseCriteria(criteria, mid);

		let score = 0;

		for (const feature of Object.keys(criteria)) {
			const rank = county.features[feature].rank;
			const normalisedRank = this.normaliseRank(feature, rank);
			const weight = normalisedCriteria[feature as keyof County] ?? mid;
			score += normalisedRank * weight;
		}

		return score / Object.keys(criteria).length;
	}

	/**
	 * Produces a list of counties ranked by the given criteria. The first county in the list is the best match and the last is the worst.
	 * @param criteria A set of weights for each feature as a value between 0 and 1.
	 * @param limit The number of counties to return.
	 */
	rankCounties(
		criteria: Partial<Record<keyof County, number>>,
		limit: number
	): (County & { score: number; stratum: number })[] {
		let counties: (County & { score: number })[] = this.counties
			.map((county) => ({ ...county, score: this.getScore(county, criteria) }))
			.sort((a, b) => b.score - a.score)
			.slice(0, limit);

		// normalise scores to be in the range (0, 1)
		let [min, max] = [counties[counties.length - 1].score, counties[0].score];
		counties = counties.map((county) => ({ ...county, score: county.score / max }));

		[min, max] = [counties[counties.length - 1].score, counties[0].score];
		const n = 5;
		const strata = Array(n + 2)
			.fill(0)
			.map((_, i) => min + ((max - min) * i) / (n + 1))
			.slice(1);

		return counties.map((county) => {
			const stratum = strata.findIndex((s) => county.score <= s);
			return { ...county, stratum };
		});
	}

	/**
	 * Get the key features for a county, such as employment or environment.
	 * @param county the county to get the key features for.
	 * @returns a list of features for the county.
	 */
	getKeyFeatures(county: County): (Feature & { key: string })[] {
		const features = categories.map((category) => {
			const entry = county.features[category.key];
			return { ...entry, key: category.name };
		});
		return features;
	}

	/**
	 * Get a description of a county, based on its key features.
	 * @param county the county to get the description for.
	 * @returns a description of the county.
	 */
	getDescription(county: County): string {
		const features = this.getKeyFeatures(county);
		const pros = features.filter((feature) => feature.rank < 100);
		const cons = features.filter((feature) => feature.rank >= this.counties.length - 1100);

		let summary = `${county['County']}  is located in ${county['State']}. It has a population of ${county.population}.`;
		if (pros.length > 0) {
			summary += ` ${county['County']} is one of the best counties for ${pros
				.map((feature) => feature.key.toLowerCase())
				.join(', ')}.`;
		}
		if (cons.length > 0) {
			summary += ` However, ${county['County']} is one of the worst counties for ${cons
				.map((feature) => feature.key.toLowerCase())
				.join(', ')}.`;
		}

		return summary;
	}
}
