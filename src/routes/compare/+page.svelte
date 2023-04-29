<script lang="ts">
	import Autocomplete from '$components/autocomplete.svelte';
	import type { PageData } from './$types';
	import { db } from '$lib/services';
	import Wrapper from '$components/wrapper.svelte';
	import type { County } from '$lib/domain/county';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { categories } from '$lib/domain/category';
	import chroma from 'chroma-js';
	import Title from '$components/title.svelte';
	import Subtitle from '$components/subtitle.svelte';

	export let data: PageData;
	let left: County | undefined = data.left;
	let right: County | undefined = data.right;
	const options = db.getCounties().map((c) => c['County, State']);

	function updateLeft(e: CustomEvent<string>) {
		left = db.getCountyByNameAndState(e.detail);
		if (!left) return;
		$page.url.searchParams.set('left', left['FIPS Code']);
		goto($page.url.toString());
	}

	function updateRight(e: CustomEvent<string>) {
		right = db.getCountyByNameAndState(e.detail);
		if (!right) return;
		$page.url.searchParams.set('right', right['FIPS Code']);
		goto($page.url.toString());
	}

	function getColours(feature: string) {
		if (!left || !right) return ['white', 'white'];
		const l = left.features[feature].value;
		const r = right.features[feature].value;

		const scale = chroma.scale(['#dc2626', 'white', '#10b981']);

		return [scale(l / (l + r)), scale(r / (r + l))];
	}
</script>

<Wrapper>
	<div class="space-y-5">
		<div>
			<Title>Compare counties</Title>
			<Subtitle
				>Easily contrast different counties with our intuitive tool. Specify the counties to compare
				using the input boxes below.</Subtitle
			>
		</div>
		<div class="flex justify-between space-x-3">
			<Autocomplete
				placeholder={'County A'}
				{options}
				value={left ? left['County, State'] : ''}
				on:select={updateLeft}
			/>
			<p>vs</p>
			<Autocomplete
				placeholder={'County B'}
				{options}
				value={right ? right['County, State'] : ''}
				on:select={updateRight}
			/>
		</div>

		{#each categories as category}
			<table class="w-full table-auto md:text-lg">
				<thead class="border">
					<tr>
						<th class="border p-2">{category.name}</th>
						<th class="border p-2">{left ? left['County'] : 'County A'}</th>
						<th class="border p-2">{right ? right['County'] : 'County B'}</th>
					</tr>
				</thead>
				{#each category.features as feature}
					<tr class="border text-center">
						<td class="border text-left pl-1 w-2/5">
							{feature.name}
						</td>
						{#if left && right}
							<td class="border" style="background-color: {getColours(feature.name)[0]};">
								{(feature.prefix || '') +
									left.features[feature.name].value +
									(feature.suffix || '')}
							</td>
							<td class="border" style="background-color: {getColours(feature.name)[1]};">
								{(feature.prefix || '') +
									right.features[feature.name].value +
									(feature.suffix || '')}
							</td>
						{:else}
							<td class="border">-</td>
							<td class="border">-</td>
						{/if}
					</tr>
				{/each}
			</table>
		{/each}
	</div>

	<div class="h-12 w-full" />
</Wrapper>
