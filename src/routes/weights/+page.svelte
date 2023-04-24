<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$components/button.svelte';
	import InlineLink from '$components/inline-link.svelte';
	import Slider from '$components/slider.svelte';
	import Subtitle from '$components/subtitle.svelte';
	import Title from '$components/title.svelte';
	import Wrapper from '$components/wrapper.svelte';

	const [min, max] = [0, 10];
	let weights: Record<string, number> = {
		Income: 1,
		'Rent affordability': 8,
		Employment: 3,
		Education: 6,
		Environment: 9
	};

	function setWeight(key: string, value: number) {
		if (!(key in weights)) return;
		weights = { ...weights, [key]: value };
	}

	function toCamelCase(s: string) {
		const split = s.split(' ');
		return (
			split[0].toLowerCase() +
			split
				.slice(1)
				.map((s) => s[0].toUpperCase() + s.slice(1))
				.join('')
		);
	}

	function submit() {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(weights)) {
			params.append(toCamelCase(key), value.toString());
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
		{#each Object.keys(weights) as weight}
			<div class="flex flex-col">
				<label for={weight} class="font-bold">{weight}</label>
				<Slider
					value={weights[weight]}
					{min}
					{max}
					step={1}
					id={weight}
					name={weight}
					on:change={(e) => setWeight(weight, e.detail)}
				/>
			</div>
		{/each}
	</section>
	<Button on:click={() => submit()}>Submit</Button>
</Wrapper>
