<script lang="ts">
	import type { PageData } from './$types';

	import Leaflet from '$lib/components/leaflet.svelte';
	import Marker from '$lib/components/marker.svelte';
	import Popup from '$lib/components/popup.svelte';
	import CityCard from '$lib/components/city-card.svelte';

	export let data: PageData;
</script>

<main>
	<Leaflet view={[data.cities[0].lat, data.cities[0].lon]}>
		{#each data.cities as city, i}
			<Marker latLng={[city.lat, city.lon]}>
				<div class="w-5 h-5 bg-red-500">
					<Popup width={200}>
						<CityCard
							{city}
							rank="{i + 1}/{data.cities.length}"
							features={data.wanted.concat(data.unwanted)}
						/>
					</Popup>
				</div>
			</Marker>
		{/each}
	</Leaflet>
</main>
