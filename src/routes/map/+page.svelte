<script lang="ts">
	import Wrapper from '$components/wrapper.svelte';
	import type { County } from '$lib/domain/county';
	import geojson from '$lib/assets/counties.json';
	import type { PageData } from './$types';
	import Leaflet from '$components/leaflet.svelte';
	import Marker from '$components/marker.svelte';
	import chroma from 'chroma-js';
	import Autocomplete from '$components/autocomplete.svelte';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	export let data: PageData;
	let map: typeof Leaflet.prototype;
	let selected: County | null = null;

	function getScoreColour(score: number) {
		const scale = chroma.scale(['#ef4444', '#fbbf24', '#10b981']).domain([0, 5]);
		return scale(score);
	}

	function selectCard(fips: string) {
		const county = data.counties.find((county) => county['FIPS Code'] == fips);
		if (!county) return;
		if (selected == county) return;
		selected = county;
		document.getElementById(`card-${fips}`)?.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center'
		});
		map.zoomTo([county.lat, county.lng]);
		autocompleteValue = county['County, State'];
	}

	function filterGeoJSON() {
		return {
			...geojson,
			features: geojson.features
				.filter((feature) =>
					data.counties.some((county) => county['FIPS Code'] == feature.properties['GEOID'])
				)
				.map((feature) => {
					const county = data.counties.find(
						(county) => county['FIPS Code'] == feature.properties['GEOID']
					);
					if (!county) return feature;
					return {
						...feature,
						properties: {
							...feature.properties,
							stratum: county.stratum,
							fips: county['FIPS Code']
						}
					};
				})
		};
	}

	function handleAutocompleteSelect(name: string) {
		const county = data.counties.find((county) => county['County, State'] == name);
		if (!county) return;
		selectCard(county['FIPS Code']);
	}

	let zoom = 8;
	let autocompleteValue = '';
</script>

<Wrapper margins={false} padding={false}>
	<div class="flex flex-col h-full bg-neutral-100 relative">
		<Leaflet
			bind:this={map}
			bind:zoom
			view={[data.counties[0].lat, data.counties[0].lng]}
			geojson={filterGeoJSON()}
			{selectCard}
		>
			{#if zoom > 7}
				{#each data.counties as county, i}
					<Marker latLng={[county.lat, county.lng]}>
						<div class="flex justify-center pointer-events-none">
							<div
								class="pointer-events-none text-overflow-center text-neutral-100 px-1 {selected ==
								county
									? 'bg-sky-600'
									: 'bg-slate-600 bg-opacity-50'} font-bold rounded"
							>
								{county['County']}
							</div>
						</div>
					</Marker>
				{/each}
			{/if}
		</Leaflet>
		<div class="absolute h-3 z-50 space-y-2 right-3 top-3">
			<div class="bg-neutral-50 border border-neutral-300 p-1 pb-0 rounded">
				<div class="flex flex-row-reverse w-full h-2">
					{#each Array(5).fill(0) as _, i}
						<div
							class="w-full {i == 0 && 'rounded-r-sm'} {i == 4 && 'rounded-l-sm'}"
							style="background-color: {getScoreColour(i)};"
						/>
					{/each}
				</div>
				<div class="flex text-[0.6rem] justify-between">
					<p>#1</p>
					<p>#{$page.url.searchParams.get('limit') || 100}</p>
				</div>
			</div>
			<Autocomplete
				on:select={(e) => handleAutocompleteSelect(e.detail)}
				bind:value={autocompleteValue}
				placeholder="Search for a county"
				options={data.counties.map((c) => c['County, State'])}
			/>
		</div>
		<div
			class="flex no-scrollbar md:flex-col md:h-full z-50 p-4 w-full md:w-auto absolute bottom-0 md:bottom-auto overflow-x-scroll md:overflow-y-scroll space-x-3 md:space-x-0 md:space-y-3"
		>
			{#each data.counties as county, i}
				<div class="select-none flex md:flex-col flex-col-reverse">
					<div
						class="shadow py-2 px-4 w-64 select-none space-y-2 transition-colors flex-shrink-0 rounded border-neutral-400 border cursor-pointer hover:bg-sky-100 bg-neutral-50 {selected ==
							county &&
							'border-sky-600 bg-sky-100 rounded-tl-none md:rounded-tl md:rounded-bl-none'}"
						id="card-{county['FIPS Code']}"
						on:click={() => selectCard(county['FIPS Code'])}
						on:keydown={() => selectCard(county['FIPS Code'])}
					>
						<div>
							<h3 class="font-bold">{i + 1}. {county['County']}</h3>
							<div class="flex justify-between items-center">
								<p>{county['State']}</p>
								<div
									class="border text-xs text-white font-bold max-w-max px-1 rounded"
									style="background-color: {getScoreColour(county.stratum)};"
								>
									{(county.score * 10).toFixed(1)}
								</div>
							</div>
						</div>
					</div>
					{#if selected == county}
						<div
							class="bg-sky-600 shadow rounded-t md:rounded-t-none md:rounded-b px-2 pb-1 pt-0 md:pb-0 cursor-pointer text-white max-w-max"
						>
							<a class="text-sm font-bold whitespace-nowrap" href="/county/{county['FIPS Code']}"
								>Read more</a
							>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</Wrapper>

<style lang="postcss">
	a {
		@apply text-neutral-100 text-base;
	}

	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.text-overflow-center {
		margin-left: -100%;
		margin-right: -100%;
		text-align: center;
	}
</style>
