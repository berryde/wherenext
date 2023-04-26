<script lang="ts">
	import Wrapper from '$components/wrapper.svelte';
	import Choropleth from '$components/choropleth.svelte';
	import Stars from '$components/stars.svelte';
	import type { County } from '$lib/domain/county';
	import geojson from '$lib/assets/counties.json';
	import type { PageData } from './$types';

	export let data: PageData;
	let counties: County[] = data.counties;
	let selected: County | null = null;
	let map: typeof Choropleth.prototype;

	function selectCard(e: MouseEvent | KeyboardEvent, county: County) {
		if (selected == county) return;
		selected = county;
		(e.currentTarget as HTMLElement).scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center'
		});
		map.zoomTo([county.lng, county.lat]);
	}
</script>

<Wrapper margins={false}>
	<div class="flex flex-col h-full bg-neutral-100 relative">
		<Choropleth {geojson} bind:this={map} />
		<div
			class="flex no-scrollbar md:flex-col md:h-full p-4 w-full md:w-auto absolute bottom-0 md:bottom-auto overflow-x-scroll md:overflow-y-scroll space-x-4 md:space-x-0 md:space-y-4"
		>
			{#each counties as county, i}
				<div class="select-none flex md:flex-col flex-col-reverse">
					<div
						class="shadow py-2 px-4 w-64 select-none space-y-2 transition-colors flex-shrink-0 rounded border-neutral-400 border bg-neutral-50 {selected ==
							county &&
							'border-sky-600  border-4 rounded-tl-none md:rounded-tl md:rounded-bl-none'}"
						on:click={(e) => selectCard(e, county)}
						on:keydown={(e) => selectCard(e, county)}
					>
						<div>
							<h3 class="text-lg font-bold">{county.county}</h3>
							<p>{county.state}</p>
						</div>
					</div>
					{#if selected == county}
						<div
							class="bg-sky-600 shadow rounded-t md:rounded-t-none md:rounded-b px-2 pb-1 pt-0 cursor-pointer text-white max-w-max"
						>
							<a class="text-sm font-bold" href="/county/{county.fipsCode}">Read more</a>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</Wrapper>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
