<script lang="ts">
	import { geoPath, geoAlbersUsa } from 'd3-geo';
	import { interpolatePuBu } from 'd3-scale-chromatic';
	import { zoom } from 'd3-zoom';
	import { select } from 'd3-selection';
	import { onDestroy, onMount } from 'svelte';
	import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
	import type { ZoomBehavior } from 'd3-zoom';
	import type { GeoPath } from 'd3-geo';
	import type { GeoProjection } from 'd3-geo';
	import { browser } from '$app/environment';
	import type { GeoPermissibleObjects } from 'd3-geo';

	export let geojson: typeof import('$lib/assets/counties.json');

	let projection: GeoProjection | null = null;
	let path: GeoPath | null = null;
	let z: ZoomBehavior<SVGElement, unknown>;

	$: width = 0;
	$: height = 0;

	export function zoomTo(pos: [number, number]) {
		if (!projection) return;
		const coords = projection(pos);
		if (!coords) return;
		const [x, y] = coords;
		const map = select<SVGElement, unknown>('#map');
		const duration = 500;
		const zoomIn = () => {
			z.scaleTo(map.transition().duration(duration), 3);
		};
		const translate = () => {
			z.translateTo(map.transition().duration(duration).on('end', zoomIn), x, y);
		};
		translate();
	}

	onMount(() => {
		if (browser) {
			z = zoom<SVGElement, unknown>().on('zoom', (event) => {
				svg.selectAll<SVGGElement, unknown>('g').attr('transform', event.transform);
			});
			const svg = select<SVGElement, unknown>('#map').call(z);
			projection = geoAlbersUsa().fitSize(
				[width, height],
				geojson as FeatureCollection<Geometry, GeoJsonProperties>
			);
			path = geoPath().projection(projection);
		}
	});

	onDestroy(() => {
		if (browser) {
			select<SVGElement, unknown>('#map').on('.zoom', null);
		}
	});

	function getPath(feature: typeof import('$lib/assets/counties.json').features[number]) {
		if (!path) return '';
		return path(feature as GeoPermissibleObjects);
	}
</script>

<div bind:clientHeight={height} bind:clientWidth={width} class="w-full h-full">
	<svg id="map" {width} {height}>
		{#if projection && path}
			<g>
				{#each geojson.features as feature}
					<path d={getPath(feature)} fill={interpolatePuBu(Math.random())} />
				{/each}
			</g>
		{/if}
	</svg>
</div>
