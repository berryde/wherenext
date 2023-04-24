<script lang="ts">
	import Wrapper from '$components/wrapper.svelte';
	import Choropleth from '$components/choropleth.svelte';
	import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
	import Stars from '$components/stars.svelte';
	import type { County } from '$lib/domain/county';

	const counties: County[] = [];

	let selected: number | null = null;
	let map: any;

	function selectCard(i: number) {
		selected = i;
		document.getElementById(`county-card-${i}`)?.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center'
		});
		map.zoomTo([-103.370391, 41.69920999906284]);
	}

	async function getGeoJson(): Promise<FeatureCollection<Geometry, GeoJsonProperties>> {
		const response = await fetch('/counties.json');
		return await response.json();
	}
</script>

<Wrapper margins={false}>
	<div class="flex flex-col h-full bg-neutral-100 relative">
		{#await getGeoJson()}
			<div class="w-full h-full" />
		{:then geojson}
			<Choropleth {geojson} bind:this={map} />
		{/await}
		<div
			class="flex no-scrollbar md:flex-col md:h-full p-4 w-full md:w-auto absolute bottom-0 md:bottom-auto overflow-x-scroll md:overflow-y-scroll space-x-4 md:space-x-0 md:space-y-4"
		>
			{#each counties as county, i}
				<div
					id={`county-card-${i}`}
					class="py-2 px-4 w-64 space-y-2 flex-shrink-0 rounded border-neutral-400 border bg-neutral-50 {selected ==
						i && 'border-sky-600 border-2'}"
					on:click={() => selectCard(i)}
					on:keydown={() => selectCard(i)}
				>
					<div>
						<h3 class="text-lg font-bold">{county.county}</h3>
						<Stars stars={5} />
					</div>
					<p class="leading-5 line-clamp-2 text-sm">
						Quod Enchiridion Epictetus stoici scripsit. Rodrigo Abela et upident.
					</p>
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
