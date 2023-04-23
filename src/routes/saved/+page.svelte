<script lang="ts">
	import Subtitle from '$components/subtitle.svelte';
	import Title from '$components/title.svelte';
	import Wrapper from '$components/wrapper.svelte';
	import { interpolateRdYlGn } from 'd3-scale-chromatic';

	type County = {
		name: string;
		description: string;
		score: number;
		features: Record<string, number>;
	};

	function getColor(score: number) {
		return interpolateRdYlGn(score / 10);
	}

	const saved: County[] = [
		{
			name: 'Boulder County',
			description:
				'Boulder County is a county in the U.S. state of Colorado. As of the 2010 census, the population was 294,567. The county seat is Boulder. The county was named for Boulder Creek, a small stream of the South Platte River that flows through it.',
			score: 9.2,
			features: {
				Income: 8.2,
				'Rent affordability': 9.2,
				Employment: 9.2,
				Education: 9.2,
				Environment: 9.2
			}
		},
		{
			name: 'Denver County',
			description:
				'Denver County is a county in the U.S. state of Colorado. As of the 2010 census, the population was 600,158. The county seat is Denver, the capital of Colorado. The county was named for James W. Denver, a territorial governor of Kansas.',
			score: 1.5,
			features: {
				Income: 2.6,
				'Rent affordability': 3.2,
				Employment: 6.6,
				Education: 4.2,
				Environment: 2.2
			}
		}
	];
</script>

<Wrapper>
	<div>
		<Title>Saved counties</Title>
		<Subtitle>
			Any counties saved during your search will be stored here for your convenience.
		</Subtitle>
	</div>
	<section class="space-y-4">
		{#each saved as county}
			<div class="flex flex-col p-4 border space-y-2 border-neutral-400 rounded">
				<div class="flex justify-between items-center">
					<h3 class="font-bold text-xl">{county.name}</h3>
					<div
						style="background-color: {getColor(county.score)};"
						class="px-3 rounded-full font-bold"
					>
						{county.score.toFixed(1)}
					</div>
				</div>
				<p class="line-clamp-3">{county.description}</p>
			</div>
		{/each}
	</section>
</Wrapper>
