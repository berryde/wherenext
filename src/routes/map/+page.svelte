<script lang="ts">
	import Wrapper from '$components/wrapper.svelte';
	import type { County } from '$lib/domain/county';
	import geojson from '$lib/assets/counties.json';
	import type { PageData } from './$types';
	import Leaflet from '$components/leaflet.svelte';
	import Marker from '$components/marker.svelte';
	import type { GeoJsonObject } from 'geojson';
	import Tooltip from '$components/tooltip.svelte';

	export let data: PageData;
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
		// map.zoomTo([county.lng, county.lat]);
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
		<Leaflet zoom={6} view={[data.counties[0].lat, data.counties[0].lng]} geojson={filterGeoJSON()}>
			{#each data.counties as county, i}
				<Marker latLng={[county.lat, county.lng]}>
					<Tooltip>
						<a href="/county/{county['FIPS Code']}" class="whitespace-nowrap"
							>{i + 1}. {county['County']}</a
						>
					</Tooltip>
				</Marker>
			{/each}
		</Leaflet>
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
</style>
