<script lang="ts">
	import Pill from '$components/pill.svelte';
	import Subtitle from '$components/subtitle.svelte';
	import Title from '$components/title.svelte';
	import Wrapper from '$components/wrapper.svelte';
	import type { County } from '$lib/domain/county';
	import type { PageData } from './$types';
	import { scaleLinear } from 'd3-scale';
	export let data: PageData;

	const county = data.county as County;
	const datasetSize = 3143;

</script>

<Wrapper margins={false}>
	<div class="w-full h-52 bg-neutral-600" />
	<div class="max-w-2xl mx-auto">
		<Title>
			{county['County']}
		</Title>
		<Subtitle>
			{county['State']} | Population {county.population}
		</Subtitle>
		<div class="flex flex-wrap gap-2">
			{#each Object.keys(county.features) as key}
				<Pill fill={"green"}>
					#{JSON.stringify(county.features[key].rank)} for {key}
				</Pill>
			{/each}
		</div>
	</div>
</Wrapper>
{JSON.stringify(data)}
