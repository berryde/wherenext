<script lang="ts">
	import { onMount } from 'svelte';
	import type { City, FeatureDescription } from '../lib/types';

	const endpoint = 'http://localhost:8000/';
	const weightColours: Record<number, string> = {
		'-1': 'bg-red-700',
		'0': 'bg-gray-500',
		'1': 'bg-green-700'
	};

	let features: {
		[key: string]: FeatureDescription;
	};
	let cities: City[];
	let weights: Record<string, number> = {};

	async function getFeatures() {
		const response = await fetch(`${endpoint}features`);
		features = await response.json();
		weights = Object.keys(features).reduce((acc, key) => {
			acc[key] = 0;
			return acc;
		}, {} as Record<string, number>);
	}

	function updateWeight(key: string) {
		weights[key] += 1;
		if (weights[key] > 1) {
			weights[key] = -1;
		}
		console.log(weights);
		weights = { ...weights };
	}

	async function submit() {
		const params = new URLSearchParams();
		Object.entries(weights).forEach(([key, value]) => {
			if (value === -1) {
				params.append('unwanted', key);
			} else if (value === 1) {
				params.append('wanted', key);
			}
		});
		const response = await fetch(`${endpoint}cities?${params.toString()}&limit=5`);
		cities = await response.json();
	}

	function getWeightedKeys() {
		weights = { ...weights };
		return Object.entries(weights).reduce((acc, [key, value]) => {
			if (value !== 0) {
				acc.push(key);
			}
			return acc;
		}, [] as string[]);
	}

	onMount(() => {
		getFeatures();
	});
</script>

<main class="text-gray-800 p-20 space-y-5">
	<div>
		<h1 class="text-3xl font-bold">Where in the world?</h1>
		<h2>Find great cities to live in based on your needs.</h2>
	</div>
	{#if features}
		<div class="space-y-2">
			<div class="flex flex-wrap gap-2">
				{#each Object.entries(features) as [key, value]}
					<div
						on:click={() => updateWeight(key)}
						on:keypress={() => updateWeight(key)}
						class="flex max-w-[15rem] flex-col {weightColours[
							weights[key]
						]} text-gray-100 select-none rounded p-1"
					>
						<h2 class="text-sm" title={value.description}>{value.label}</h2>
					</div>
				{/each}
			</div>
			<div class="flex justify-between">
				<p class="text-xs">
					Select a feature to adjust your preferences. Hovering reveals more information.
				</p>
				<div class="flex space-x-3 text-xs text-gray-100">
					<div class="py-0.5 px-1 whitespace-nowrap max-h-min rounded bg-green-700">Wanted</div>
					<div class="py-0.5 px-1 whitespace-nowrap max-h-min rounded bg-gray-500">
						No preference
					</div>
					<div class="py-0.5 px-1 whitespace-nowrap max-h-min rounded bg-red-700">Unwanted</div>
				</div>
			</div>
			<button class="bg-blue-500 py-1 px-2 text-gray-100 rounded" on:click={submit}>Submit</button>
		</div>
	{/if}
	{#if cities}
		{#each cities as city}
			<div class="bg-gray-100 p-2 rounded">
				<div class="flex justify-between">
					<h2>{city.name}, {city.country}</h2>
					<h2 class="text-xs">
						{city.population.value} inhabitants | {city.meanTemp.value}°C mean temperature | {city
							.precipitation.value}mm rainfall annualy
					</h2>
				</div>
				<div class="flex flex-wrap gap-1">
					{#each getWeightedKeys() as key}
						<p class="text-xs">#{city[key].rank} for {features[key].label}.</p>
					{/each}
				</div>
				<a class="text-blue-500 text-sm hover:text-blue-600" href={city.wikidata}>Learn more</a>
			</div>
		{/each}
	{/if}
</main>
