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
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { db } from '$lib/services';

	export let data: PageData;

	const county = data.county as County;

	function getPillColour(name: string, rank: number) {
		const category = categories.find((c) => c.name == name);
		if (!category) return chroma('white');
		const scale = chroma
			.scale(['#10b981', 'white', '#dc2626'])
			.domain([category.min, category.max]);
		return scale(rank);
	}

	function getGeoJSON() {
		return {
			...geojson,
			features: geojson.features.filter(
				(feature) => feature.properties['GEOID'] == county['FIPS Code']
			)
		};
	}

	onMount(() => {
		const existing = JSON.parse(localStorage.getItem('saved') || '[]');
		saved = existing.some((c: County) => c['FIPS Code'] == county['FIPS Code']);
	});

	let saved = false;

	function save() {
		const existing = JSON.parse(localStorage.getItem('saved') || '[]');
		if (existing.some((c: County) => c['FIPS Code'] == county['FIPS Code'])) {
			localStorage.setItem(
				'saved',
				JSON.stringify(existing.filter((c: County) => c['FIPS Code'] != county['FIPS Code']))
			);
			saved = false;
		} else {
			localStorage.setItem('saved', JSON.stringify([...existing, county]));
			saved = true;
		}
	}
</script>

<Wrapper margins={false} padding={false}>
	<div class="relative h-60 w-full bg-neutral-400 shadow-inner">
		<Leaflet view={[county.lat, county.lng]} interactive={false} zoom={8} geojson={getGeoJSON()} />
		<div class="absolute w-full z-50 left-0 top-0">
			<div class="flex justify-end mx-auto space-x-3 max-w-3xl p-3">
				<a
					href="/compare?left={county['FIPS Code']}"
					class="leading-7 px-2 py-1 cursor-pointer bg-sky-600 rounded text-neutral-100 hover:bg-sky-800 font-bold transition-colors"
					>Compare</a
				>
				<div
					class="p-2 bg-slate-800 rounded cursor-pointer text-yellow-500 hover:text-slate-800 transition-colors hover:bg-yellow-500"
					on:keypress={() => save()}
					on:click={() => save()}
				>
					<Icon
						icon={saved ? 'ion:bookmark' : 'ion:bookmark-outline'}
						class=" h-full w-5"
						inline={true}
					/>
				</div>
			</div>
		</div>
	</div>
	<div class="max-w-3xl mx-auto space-y-8 py-12 px-4">
		<div class="space-y-4">
			<Title>
				{county['County']}
			</Title>
			<Subtitle>
				{db.getDescription(county)}
			</Subtitle>
			<div class="flex flex-wrap gap-2">
				{#each db.getKeyFeatures(county) as feature}
					<Pill fill={getPillColour(feature.key, feature.rank)}>
						<p>#{feature.rank} for {feature.key}</p>
					</Pill>
				{/each}
			</div>
		</div>

		{#each categories as category}
			<table class="table-auto w-full md:text-lg">
				<thead>
					<tr>
						<th class="border p-2">{category.name}</th>
						<th class="border p-2">Percentile</th>
						<th class="border p-2">Rank</th>
						<th class="border p-2">Value</th>
					</tr>
				</thead>
				{#each category.features as feature}
					<tr class="border text-center">
						<td class="border text-left pl-1 w-full">{feature.name}</td>
						<td class="border">
							{county.features[feature.name].percentile
								? county.features[feature.name].percentile?.toFixed(2) + '%'
								: '-'}
						</td>
						<td class=" border">{county.features[feature.name].rank}</td>
						<td class=" border">
							{(feature.prefix || '') +
								county.features[feature.name].value +
								(feature.suffix || '')}
						</td>
					</tr>
				{/each}
			</table>
		{/each}
	</div>
</Wrapper>
