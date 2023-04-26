<script lang="ts">
	import Wrapper from '$components/wrapper.svelte';
	import Choropleth, { type GeoCountyFeature } from '$components/choropleth.svelte';
	import type { County } from '$lib/domain/county';
	import geojson from '$lib/assets/counties.json';
	import type { PageData } from './$types';

	export let data: PageData;
	let selected: County | null = null;
	let map: typeof Choropleth.prototype;

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
		map.zoomTo([county.lng, county.lat]);
	}

	function isActive(feature: GeoCountyFeature) {
		return data.counties.some((county) => county['FIPS Code'] == feature.properties.GEOID);
	}

	function getID(feature: GeoCountyFeature) {
		return feature.properties.GEOID;
	}

	function getValue(feature: GeoCountyFeature) {
		const county = data.counties.find((county) => county['FIPS Code'] == feature.properties.GEOID);
		if (!county) return 0;
		return county.score;
	}
</script>

<Wrapper margins={false}>
	<div class="flex flex-col h-full bg-neutral-100 relative">
		<Choropleth
			{geojson}
			bind:this={map}
			{isActive}
			{getValue}
			{getID}
			selectedID={selected ? selected['FIPS Code'] : ''}
		/>
		<div
			class="flex no-scrollbar md:flex-col md:h-full p-4 w-full md:w-auto absolute bottom-0 md:bottom-auto overflow-x-scroll md:overflow-y-scroll space-x-4 md:space-x-0 md:space-y-4"
		>
			{#each data.counties as county, _}
				<div class="select-none flex md:flex-col flex-col-reverse">
					<div
						class="shadow py-2 px-4 w-64 select-none space-y-2 transition-colors flex-shrink-0 rounded border-neutral-400 border bg-neutral-50 {selected ==
							county &&
							'border-sky-600  border-4 rounded-tl-none md:rounded-tl md:rounded-bl-none'}"
						id="card-{county['FIPS Code']}"
						on:click={() => selectCard(county['FIPS Code'])}
						on:keydown={() => selectCard(county['FIPS Code'])}
					>
						<div>
							<h3 class="text-lg font-bold">{county['County']}</h3>
							<p>{county['State']}</p>
						</div>
					</div>
					{#if selected == county}
						<div
							class="bg-sky-600 shadow rounded-t md:rounded-t-none md:rounded-b px-2 pb-1 pt-0 md:pb-0 cursor-pointer text-white max-w-max"
						>
							<a class="text-sm font-bold" href="/county/{county['FIPS Code']}">Read more</a>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</Wrapper>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
