<script lang="ts">
	import { browser } from '$app/environment';
	import type { LayerGroup, LatLngExpression, Marker } from 'leaflet';
	import { getContext, onMount, setContext } from 'svelte';
	import type {} from 'leaflet';
	let leaflet: typeof import('leaflet');

	export let marker: Marker | undefined = undefined;
	export let width = 30;
	export let height = 30;
	export let latLng: LatLngExpression = [0, 0];

	const layerGroup = getContext<() => LayerGroup>('layerGroup')();
	setContext('layer', () => marker);
	function createMarker(markerElement: HTMLElement) {
		let icon = leaflet.divIcon({
			html: markerElement,
			className: 'map-marker',
			iconSize: leaflet.point(width, height)
		});
		marker = leaflet
			.marker(latLng, {
				icon
			})
			.addTo(layerGroup);
		return {
			destroy() {
				if (marker) {
					marker.remove();
					marker = undefined;
				}
			}
		};
	}
	onMount(async () => {
		if (browser) {
			leaflet = await import('leaflet');
		}
	});
</script>

<div class="hidden pointer-events-none">
	{#if leaflet}
		<div use:createMarker class="flex pointer-events-none">
			{#if marker}
				<slot />
			{/if}
		</div>
	{/if}
</div>
