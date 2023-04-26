<script lang="ts" context="module">
	export type GeoCountyFeature = typeof import('$lib/assets/counties.json').features[number];
</script>

<script lang="ts">
	import { geoPath, geoAlbersUsa } from 'd3-geo';
	import { interpolateGreens } from 'd3-scale-chromatic';
	import { zoom } from 'd3-zoom';
	import { select } from 'd3-selection';
	import { onDestroy, onMount } from 'svelte';
	import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
	import type { ZoomBehavior } from 'd3-zoom';
	import type { GeoPath } from 'd3-geo';
	import type { GeoProjection } from 'd3-geo';
	import { browser } from '$app/environment';
	import type { GeoPermissibleObjects } from 'd3-geo';
	import { createEventDispatcher } from 'svelte';

	export let geojson: typeof import('$lib/assets/counties.json');
	export let isActive: (feature: GeoCountyFeature) => boolean = () => false;
	export let selectedID: string = '';
	export let getID: (feature: GeoCountyFeature) => string;
	export let getValue: (feature: GeoCountyFeature) => number = () => 0;

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
			z.scaleTo(map.transition().duration(duration), 12);
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

	function getFill(feature: GeoCountyFeature) {
		return interpolateGreens(getValue(feature));
	}

	function getPath(feature: GeoCountyFeature) {
		if (!path) return '';
		return path(feature as GeoPermissibleObjects);
	}

	const dispatch = createEventDispatcher();
	function handleClick(feature: GeoCountyFeature) {
		dispatch('select', feature);
	}

	$: active = geojson.features.filter(isActive);
	$: selected = active.find((feature) => getID(feature) == selectedID);
</script>

<div bind:clientHeight={height} bind:clientWidth={width} class="w-full h-full">
	<svg id="map" {width} {height}>
		{#if projection && path}
			<g>
				{#each geojson.features as feature}
					<path d={getPath(feature)} class="fill-neutral-400" />
				{/each}
			</g>
			<g>
				{#each active as feature}
					<path
						d={getPath(feature)}
						on:click={() => handleClick(feature)}
						on:keypress={(event) => {
							if (event.key == 'Enter') handleClick(feature);
						}}
						stroke-linecap="round"
						class="cursor-pointer"
						fill={getFill(feature)}
					/>
				{/each}
				{#if selected}
					<path
						d={getPath(selected)}
						class="stroke-sky-800 fill-sky-600 stroke-[0.5] transition-all duration-1000 cursor-pointer"
					/>
				{/if}
			</g>
		{/if}
	</svg>
</div>
