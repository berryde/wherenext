<script lang="ts">
	import Wrapper from '$components/wrapper.svelte';
	import Choropleth from '$components/choropleth.svelte';
	import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
	import Title from '$components/title.svelte';
	import Stars from '$components/stars.svelte';
	import { flip } from 'svelte/animate';
	import { linear } from 'svelte/easing';

	async function getGeoJson(): Promise<FeatureCollection<Geometry, GeoJsonProperties>> {
		const response = await fetch('/counties.json');
		return await response.json();
	}

	const counties: {
		name: string;
		stars: number;
	}[] = [
		{
			name: 'Alameda',
			stars: 5
		},
		{
			name: 'Contra Costa',
			stars: 4
		},
		{
			name: 'Marin',
			stars: 3
		},
		{
			name: 'Napa',
			stars: 2
		}
	];

	function selectCard(i: number) {
		selected = i;
		// scroll the element into view
		document.getElementById(`county-card-${i}`)?.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center'
		});
	}

	let selected = 0;
</script>

<Wrapper margins={false}>
	<div class="flex flex-col h-full bg-neutral-100 relative">
		{#await getGeoJson()}
			<div class="w-full h-full" />
		{:then geojson}
			<Choropleth {geojson} />
		{/await}
		<div class="flex p-4 w-full absolute bottom-0 md:bottom-auto overflow-scroll space-x-4">
			{#each counties as county, i}
				<div
					id={`county-card-${i}`}
					class="py-2 px-4 w-64 space-y-2 flex-shrink-0 rounded border-neutral-400 border bg-neutral-50 {selected ==
						i && 'border-sky-600 border-2'}"
					on:click={() => selectCard(i)}
					on:keydown={() => selectCard(i)}
				>
					<div>
						<h3 class="text-lg font-bold">{county.name}</h3>
						<Stars stars={county.stars} />
					</div>
					<p class="leading-5 line-clamp-2 text-sm">
						Quod Enchiridion Epictetus stoici scripsit. Rodrigo Abela et upident.
					</p>
				</div>
			{/each}
		</div>
	</div>
</Wrapper>
