<script lang="ts">
	import { getDescription } from '$lib/api';
	import type { City } from '$lib/types';

	export let features: string[] = [];
	export let city: City;
	export let rank: string = '';

	async function getSummary() {
		const summary = [];
		for (const feature of features.slice(0, 5)) {
			const d = await getDescription(feature);
			summary.push(`#${city.features[feature].rank} for ${d.label}.`);
		}
		return summary.join(' ');
	}

	function format(s: string | number) {
		if (typeof s === 'string') {
			s = parseInt(s);
		}
		// use intl.NumberFormat to format numbers to G, M K etc
		const formatter = new Intl.NumberFormat('en-US', {
			notation: 'compact'
		});
		return formatter.format(s);
	}
</script>

<div class="text-xs leading-3 space-y-2">
	<p class="text-base leading-4">{city.name}, {city.country}</p>
	<p class=" text-gray-500">
		{rank} | {city.score} CityScore | Pop. {format(city.features.population.value)}
	</p>
	{#await getSummary() then summary}
		<p class=" text-gray-700">{summary}</p>
	{/await}
	<div><a href="/city/{city.id}">Learn more</a></div>
</div>
