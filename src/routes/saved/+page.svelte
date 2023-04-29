<script lang="ts">
	import Subtitle from '$components/subtitle.svelte';
	import Title from '$components/title.svelte';
	import Wrapper from '$components/wrapper.svelte';
	import type { County } from '$lib/domain/county';
	import { db } from '$lib/services';
	import { onMount } from 'svelte';

	let saved: County[] = [];

	onMount(() => {
		saved = JSON.parse(localStorage.getItem('saved') || '[]');
	});
</script>

<Wrapper>
	<div>
		<Title>Saved counties</Title>
		<Subtitle>
			Any counties saved during your search will be stored here for your convenience. Select a
			county card to view more information.
		</Subtitle>
	</div>
	<section class="space-y-3">
		{#each saved as county}
			<a
				href={`/county/${county['FIPS Code']}`}
				class="flex flex-col cursor-pointer hover:text-sky-700 transition-colors p-4 border space-y-2 border-neutral-400 rounded"
			>
				<div class="flex flex-col space-y-1">
					<h3 class="font-bold text-xl">{county['County']}, {county['State']}</h3>
					<p class="line-clamp-2">{db.getDescription(county)}</p>
				</div>
			</a>
		{/each}
	</section>
</Wrapper>
