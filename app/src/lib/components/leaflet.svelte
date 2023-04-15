<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import { onDestroy, onMount, setContext } from 'svelte';
	import { browser } from '$app/environment';
	import type { Map } from 'leaflet';

	export const getMap = () => map;
	export let view: [number, number] = [0, 0];
	export let zoom: number = 3;

	let mapElement: HTMLElement;
	let map: Map;
	setContext('layerGroup', getMap);
	setContext('layer', getMap);
	setContext('map', getMap);

	onMount(async () => {
		if (browser) {
			const leaflet = await import('leaflet');
			map = leaflet.map(mapElement).setView(view, zoom);
			leaflet
				.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution:
						'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				})
				.addTo(map);
		}
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div bind:this={mapElement} class="h-screen w-full">
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
</style>
