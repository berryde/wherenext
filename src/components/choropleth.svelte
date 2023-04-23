<script lang="ts">
	import { geoPath, geoAlbersUsa } from 'd3-geo';
	import { interpolateBlues } from 'd3-scale-chromatic';
	import { zoom } from 'd3-zoom';
	import { select } from 'd3-selection';
	import { onDestroy, onMount } from 'svelte';
	import type { GeoPath } from 'd3-geo';
	import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
	import type { Feature } from 'geojson';
	import type { GeoProjection } from 'd3-geo';

	export let geojson: FeatureCollection<Geometry, GeoJsonProperties>;

	let projection = geoAlbersUsa();
	let path = geoPath();

	$: width = 0;
	$: height = 0;

	onMount(() => {
		const svg = select<SVGElement, unknown>('#map').call(
			zoom<SVGElement, unknown>().on('zoom', (event) => {
				svg.selectAll<SVGGElement, unknown>('g').attr('transform', event.transform);
			})
		);
		projection = geoAlbersUsa().fitSize([width, height], geojson);
		path = geoPath().projection(projection);
	});

	onDestroy(() => {
		select<SVGElement, unknown>('#map').on('.zoom', null);
	});
</script>

<div bind:clientHeight={height} bind:clientWidth={width} class="w-full h-full">
	<svg id="map" {width} {height}>
		<g>
			{#each geojson.features as feature}
				<path d={path(feature)} fill={interpolateBlues(Math.random())} />
			{/each}
		</g>
	</svg>
</div>
