<script lang="ts">
	import { page } from '$app/stores';
	import Pill from '$components/pill.svelte';
	import Subtitle from '$components/subtitle.svelte';
	import Title from '$components/title.svelte';
	import Wrapper from '$components/wrapper.svelte';
	import type { County } from '$lib/domain/county';
	import type { PageData } from './$types';
	export let data: PageData;

	const county = data.county as County;
</script>

<Wrapper margins={false}>
	<div class="w-full h-52 bg-neutral-600"/>
	<div class="max-w-2xl mx-auto">
		<Title>
			{county.county}
		</Title>
		<Subtitle>
			{county.state} | Population {county.population}
		</Subtitle>
		<div class="flex flex-wrap">
				<Pill>
					{JSON.stringify(county.rentAffordability)}
				</Pill>
		</div>
	</div>
</Wrapper>
{JSON.stringify(data)}
