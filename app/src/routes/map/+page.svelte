<script>
	import Wrapper from '$components/wrapper.svelte';
	import { geoPath, geoAlbersUsa } from 'd3-geo';
	import { scaleSequential } from 'd3-scale';
	import { interpolateBlues } from 'd3-scale-chromatic';
	import { zoom } from 'd3-zoom';
	import { select } from 'd3-selection';
	import { onMount } from 'svelte';

	$: width = 0;
	$: height = 0;
	$: geoJSON && render();

	let geoJSON;
	let path;
	let svg;

	onMount(() => {
		fetchData();
		render();
	});

	async function fetchData() {
		const response = await fetch('/counties.json');
		geoJSON = await response.json();
		console.log(geoJSON);
	}

	function render() {
		path = geoPath().projection(geoAlbersUsa().fitSize([width, height], geoJSON));
		svg = select('#map').call(
			zoom().on('zoom', (event) => {
				svg.selectAll('g').attr('transform', event.transform);
			})
		);
	}
</script>

<Wrapper margins={false}>
	<!-- TODO: add USA choropleth with D3 -->
	<div bind:clientHeight={height} bind:clientWidth={width} class="w-full h-full">
		<svg id="map" {width} {height}>
			{#if geoJSON}
				<g>
					{#each geoJSON.features as feature}
						<path d={path(feature)} fill={interpolateBlues(Math.random())}>
						</path>
					{/each}
				</g>
			{/if}
		</svg>
	</div>
</Wrapper>
