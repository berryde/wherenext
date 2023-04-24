<script lang="ts">
	import { geoPath, geoAlbersUsa } from 'd3-geo';
	import { interpolateBlues } from 'd3-scale-chromatic';
	import { zoom } from 'd3-zoom';
	import { select } from 'd3-selection';
	import { onDestroy, onMount } from 'svelte';
	import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
	import type { ZoomBehavior } from 'd3-zoom';

	export let geojson: FeatureCollection<Geometry, GeoJsonProperties>;

	let projection = geoAlbersUsa();
	let path = geoPath();
	let z: ZoomBehavior<SVGElement, unknown>;

	$: width = 0;
	$: height = 0;

	export function zoomTo(pos: [number, number]) {
		const [x, y] = projection(pos)!;
		z.translateTo(select<SVGElement, unknown>('#map'), x, y);
		z.scaleTo(select<SVGElement, unknown>('#map'), 3);
	}

	onMount(() => {
		z = zoom<SVGElement, unknown>().on('zoom', (event) => {
			svg.selectAll<SVGGElement, unknown>('g').attr('transform', event.transform);
		});
		const svg = select<SVGElement, unknown>('#map').call(z);
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
