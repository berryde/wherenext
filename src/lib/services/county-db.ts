import type { County } from '../domain/county';
import dataset from '$lib/assets/dataset.json';

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
	 * Scores a county based on the given criteria.
	 * @param county The county to score
	 * @param criteria A set of weights for each feature as a value between 0 and 1.
	 * @returns The score for the county
	 */
	private getScore(county: County, criteria: Partial<Record<keyof County, number>>): number {
		// TODO: Implement this method
		return Math.random();
	}

	/**
	 * Produces a list of counties ranked by the given criteria. The first county in the list is the best match and the last is the worst.
	 * @param criteria A set of weights for each feature as a value between 0 and 1.
	 * @param limit The number of counties to return.
	 */
	rankCounties(
		criteria: Partial<Record<keyof County, number>>,
		limit: number
	): (County & { score: number })[] {
		return (
			this.counties
				.map((county) => ({ ...county, score: this.getScore(county, criteria) }))
				// .sort((a, b) => b.score - a.score)
				.sort((a, b) => Math.random() - 0.5)
				.slice(0, limit)
		);
	}
}
