<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import { onDestroy, onMount, setContext } from 'svelte';
	import { browser } from '$app/environment';
	import type { Map } from 'leaflet';
	import type { GeoJsonObject } from 'geojson';
	import chroma from 'chroma-js';

	export const getMap = () => map;
	export let geojson: typeof import('$lib/assets/counties.json') | null = null;
	export let view: [number, number] = [0, 0];
	export let zoom: number = 3;
	export let interactive = true;

	let mapElement: HTMLElement;
	let map: Map;

	setContext('layerGroup', getMap);
	setContext('layer', getMap);
	setContext('map', getMap);

	export let selectCard: (fips: string) => void = () => {};

	function getColour(stratum: number) {
		const scale = chroma.scale(['#ef4444', '#fbbf24', '#10b981']).domain([0, 5]);
		return scale(stratum).hex();
	}

	export function zoomTo(pos: [number, number]) {
		map.setView(pos, 9, {
			animate: true,
			duration: 0.5
		});
	}
	let leaflet: typeof import('leaflet') | null = null;

	onMount(async () => {
		if (browser) {
			leaflet = await import('leaflet');
			map = leaflet
				.map(mapElement, {
					zoomControl: false,
					attributionControl: false,
					preferCanvas: true
				})
				.setView(view, zoom);

			map.addEventListener('zoomend', () => {
				zoom = map.getZoom();
			});

			if (!interactive) {
				map.dragging.disable();
				map.touchZoom.disable();
				map.doubleClickZoom.disable();
				map.scrollWheelZoom.disable();
				map.boxZoom.disable();
				map.keyboard.disable();
				if (map.tap) map.tap.disable();
			}

			leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

			if (geojson) {
				leaflet
					.geoJson(geojson as GeoJsonObject, {
						style: (feature) => {
							return {
								color: !interactive ? '#0284c7' : '#404040',
								weight: 1,
								fillOpacity: 0.7,
								fillColor: !interactive ? '#0284c7' : getColour(feature?.properties.stratum)
							};
						},
						onEachFeature: (feature, layer) => {
							layer.on({
								click: () => {
									selectCard(feature?.properties.fips);
								}
							});
						}
					})
					.addTo(map);
			}
		}
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div bind:this={mapElement} class="h-full w-full z-40 {!interactive && 'cursor-default'}">
	{#if map}
		<slot />
	{/if}
</div>

<style lang="postcss">
	:global(.leaflet-popup-content-wrapper) {
		/* Styles the container for popup content */
		@apply rounded space-y-0;
	}
	:global(.leaflet-popup-content) {
		/* Styles popup content */
	}
	:global(.leaflet-popup-content p) {
		@apply m-0;
	}
	:global(.leaflet-control-attribution) {
		display: none;
	}
</style>
