<script lang="ts">
	import Pill from '$components/pill.svelte';
	import Subtitle from '$components/subtitle.svelte';
	import Title from '$components/title.svelte';
	import Wrapper from '$components/wrapper.svelte';
	import type { County } from '$lib/domain/county';
	import type { PageData } from './$types';
	import Leaflet from '$components/leaflet.svelte';
	import geojson from '$lib/assets/counties.json';
	import { categories } from '$lib/domain/category';
	import chroma from 'chroma-js';
	import Button from '$components/button.svelte';
	import TableRow from '$components/table-row.svelte';
	import Table from '$components/table.svelte';

	export let data: PageData;

	const county = data.county as County;
	const datasetSize = 3143;
	const getPillColour = chroma.scale(['#10b981', 'white', '#dc2626']).domain([0, datasetSize]);

	function getGeoJSON() {
		return {
			...geojson,
			features: geojson.features.filter(
				(feature) => feature.properties['GEOID'] == county['FIPS Code']
			)
		};
	}

	function getHighlights() {
		// get the 5 lowest rank features
		const features = categories.map((category) => {
			const entry = county.features[category.key];
			return { ...entry, key: category.name };
		});
		return features;
	}

	function getSummary() {
		const pros = getHighlights().filter((feature) => feature.rank < 100);
		const cons = getHighlights().filter((feature) => feature.rank >= datasetSize - 1100);
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
</script>

<Wrapper margins={false}>
	<div class="h-60 w-full bg-neutral-400 shadow-inner">
		<Leaflet view={[county.lat, county.lng]} interactive={false} zoom={8} geojson={getGeoJSON()} />
	</div>
	<div class="max-w-2xl mx-auto space-y-8 p-5 pb-12">
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<Title>
					{county['County, State']}
				</Title>
				<a
					href="/compare?left={county['FIPS Code']}"
					class="px-2 py-1 cursor-pointer border border-sky-600 rounded text-sky-700 hover:bg-sky-600 font-bold hover:text-neutral-100 transition-colors"
					>Compare</a
				>
			</div>
			<p>
				{getSummary()}
			</p>
			<div class="flex flex-wrap gap-2">
				{#each getHighlights() as highlight}
					<Pill fill={getPillColour(highlight.rank)}>
						<p>#{highlight.rank} for {highlight.key}</p>
					</Pill>
				{/each}
			</div>
		</div>
		<hr />

		{#each categories as category}
			<div class="space-y-2">
				<p class="text-2xl font-semibold">{category.name}</p>
				<Table headers={['Category', 'Percentile', 'Rank', 'Value']}>
					{#each category.features as feature}
						<TableRow
							data={[
								feature.name,
								county.features[feature.name].percentile
									? county.features[feature.name].percentile?.toFixed(2) + '%'
									: '-',
								county.features[feature.name].rank,
								(feature.prefix || '') +
									county.features[feature.name].value +
									(feature.suffix || '')
							]}
						/>
					{/each}
				</Table>
			</div>
		{/each}
	</div>
</Wrapper>
