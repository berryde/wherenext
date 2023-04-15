<script lang="ts">
	import { browser } from '$app/environment';
	import type { Marker, Layer, Popup } from 'leaflet';
	import { getContext, onMount } from 'svelte';

	let leaflet: typeof import('leaflet');

	let classNames: string = '';
	export { classNames as class };
	export let width = 100;

	export let popup: Popup | undefined = undefined;
	let showContents = false;
	let popupOpen = false;

	const layer = getContext<() => Layer>('layer')();

	function createPopup(popupElement: HTMLElement) {
		popup = leaflet
			.popup({
				minWidth: width
			})
			.setContent(popupElement);
		layer.bindPopup(popup);
		layer.on('popupopen', () => {
			popupOpen = true;
			showContents = true;
		});
		layer.on('popupclose', () => {
			popupOpen = false;
			setTimeout(() => {
				if (!popupOpen) showContents = false;
			}, 500);
		});
		return {
			destroy() {
				if (popup) {
					layer.unbindPopup();
					popup.remove();
					popup = undefined;
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

<div class="hidden">
	{#if leaflet}
		<div use:createPopup class={classNames}>
			{#if showContents}
				<slot />
			{/if}
		</div>
	{/if}
</div>
