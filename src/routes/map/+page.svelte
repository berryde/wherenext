<script lang="ts">
	import Wrapper from '$components/wrapper.svelte';
	import type { County } from '$lib/domain/county';
	import geojson from '$lib/assets/counties.json';
	import type { PageData } from './$types';
	import Leaflet from '$components/leaflet.svelte';
	import Marker from '$components/marker.svelte';
	import type { GeoJsonObject } from 'geojson';

	export let data: PageData;
	let map: typeof Leaflet.prototype;
	let selected: County | null = null;

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
	}

	function filterGeoJSON(): GeoJsonObject {
		return {
			...geojson,
			features: geojson.features.filter((feature) =>
				data.counties.some((county) => county['FIPS Code'] == feature.properties['GEOID'])
			)
		} as GeoJsonObject;
	}
</script>

<Wrapper margins={false}>
	<div class="flex flex-col h-full bg-neutral-100 relative">
		<Leaflet
			bind:this={map}
			zoom={6}
			view={[data.counties[0].lat, data.counties[0].lng]}
			geojson={filterGeoJSON()}
		>
			{#each data.counties as county, i}
				<Marker latLng={[county.lat, county.lng]}>
					<div
						class="flex justify-center"
						on:keypress={() => selectCard(county['FIPS Code'])}
						on:click={() => selectCard(county['FIPS Code'])}
					>
						<div class="text-overflow-center text-neutral-100 px-1 bg-sky-600 rounded">
							{county['County']}
						</div>
					</div>
				</Marker>
			{/each}
		</Leaflet>
		<div
			class="flex no-scrollbar md:flex-col md:h-full z-50 p-4 w-full md:w-auto absolute bottom-0 md:bottom-auto overflow-x-scroll md:overflow-y-scroll space-x-3 md:space-x-0 md:space-y-3"
		>
			{#each data.counties as county, i}
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
							<h3 class="font-bold">{i + 1}. {county['County']}</h3>
							<p>{county['State']}</p>
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
