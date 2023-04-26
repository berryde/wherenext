<script lang="ts">
	import Pill from '$components/pill.svelte';
	import Subtitle from '$components/subtitle.svelte';
	import Title from '$components/title.svelte';
	import Wrapper from '$components/wrapper.svelte';
	import type { County } from '$lib/domain/county';
	import type { PageData } from './$types';
	import { scaleLinear } from 'd3-scale';
	export let data: PageData;

	const county = data.county as County;
	const datasetSize = 3143;

	function getPillColour(rank: number) {
		const colours = ['#dc2626', '#eab308', '#10b981'];
		const stops = Array(colours.length)
			.fill(0)
			.map((_, i) => (i + 1) * (datasetSize / colours.length))
			.reverse();
		stops.push(0);
		console.log(stops);
		const scale = scaleLinear<string>().domain(stops).range(colours);
		return scale(rank);
	}
</script>

<Wrapper margins={false}>
	<div class="w-full h-52 bg-neutral-600" />
	<div class="max-w-2xl mx-auto space-y-8">
		<div>
			<Title>
				{county['County']}
			</Title>
			<Subtitle>
				{county['State']} | Population {county.population}
			</Subtitle>
		</div>
		<div class="flex flex-wrap gap-2">
			{#each Object.keys(county.features).slice(5, 11) as key}
				<Pill fill={getPillColour(county.features[key].rank)}>
					<p>#{county.features[key].rank} for {key}</p>
				</Pill>
			{/each}
		</div>
		<table class="w-full table-auto">
			<thead class="border">
				<tr class="border">
					<th class="p-3 border"> Category </th>
					<th class="p-3 border"> Percentile </th>
					<th class="p-3 border"> Rank </th>
					<th class="p-3 border"> Value </th>
				</tr>
			</thead>
			<tbody>
				{#each Object.keys(county.features) as key}
					<tr>
						<td class="p-1 border"> {key} </td>
						<td class="p-1 border">
							{county.features[key].percentile
								? county.features[key].percentile?.toFixed(2) + '%'
								: '-'}
						</td>
						<td class="p-1 border"> #{county.features[key].rank} </td>
						<td class="p-1 border"> {county.features[key].value} </td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</Wrapper>
