<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$components/button.svelte';
	import InlineLink from '$components/inline-link.svelte';
	import Slider from '$components/slider.svelte';
	import Subtitle from '$components/subtitle.svelte';
	import Title from '$components/title.svelte';
	import Wrapper from '$components/wrapper.svelte';
	import { categories, type Category } from '$lib/domain/category';
	import { onMount } from 'svelte';

	const [min, max] = [0, 10];
	let weights: Map<Category, number> = new Map();

	onMount(() => {
		const values = JSON.parse(localStorage.getItem('weights') || '{}');
		weights = new Map<Category, number>(
			categories.map((category) => [category, values[category.key] ?? 5])
		);
	});

	function resetWeights() {
		weights = new Map<Category, number>(categories.map((category) => [category, 5]));
		saveWeights();
	}

	function saveWeights() {
		const values: Record<string, number> = {};
		for (const [category, weight] of weights) {
			values[category.key] = weight;
		}
		localStorage.setItem('weights', JSON.stringify(values));
	}

	function setWeight(category: Category, value: number) {
		if (!weights.has(category)) return;
		weights.set(category, value);
		saveWeights();
	}

	function submit() {
		const params = new URLSearchParams();
		for (const [category, weight] of weights) {
			params.set(category.key, weight.toString());
		}

		goto(`/map?${params.toString()}`);
	}
</script>

<Wrapper>
	<div>
		<Title>Adjust weights</Title>
		<Subtitle
			>Prioritise features that are important to you for the best results.
			<InlineLink href="/about">Learn more</InlineLink>
		</Subtitle>
	</div>
	<section class="space-y-4">
		{#each categories as category}
			<div class="flex flex-col">
				<label for={category.name} class="font-bold">{category.name}</label>
				{#key weights}
					<Slider
						value={weights.get(category)}
						{min}
						{max}
						step={1}
						name={category.name}
						on:change={(e) => setWeight(category, e.detail)}
					/>
				{/key}
			</div>
		{/each}
		<div class="flex flex-row text-sm font-light">
			<p class="w-full flex-grow">Unwanted</p>
			<p>Neutral</p>
			<p class="w-full flex-grow flex justify-end">Desired</p>
		</div>
	</section>
	<div class="flex space-x-3">
		<Button on:click={() => submit()}>Submit</Button>
		<Button variant="danger" on:click={() => resetWeights()}>Reset</Button>
	</div>
</Wrapper>
