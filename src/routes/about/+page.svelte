<script lang="ts">
	import Subtitle from '$components/subtitle.svelte';
	import Title from '$components/title.svelte';
	import Wrapper from '$components/wrapper.svelte';

	// a map of feature to description
	const features: Record<string, string> = {
		Income: 'The median income of residents in the area',
		'Rent affordability':
			'This feature describes the median rent across various types of housing in the area. High rent affordability indicates that the median rent is relatively low.',
		Employment:
			'A description of the unemployment rate for this county. A high employment score indicates low unemployment.',
		Education: "The percentage of adults with bachelor's degrees or higher in a given county.",
		Environment:
			'The environmental quality of the area, as defined by the environmental quality index. This feature can is a composite of air, water, land, built area and sociodemograhpic qualities.'
	};
</script>

<Wrapper>
	<div>
		<Title>County features</Title>
		<Subtitle>
			Learn more about which features we use to help find matches for you, and what they mean.
		</Subtitle>
	</div>
	<section class="space-y-4">
		{#each Object.keys(features) as feature}
			<div class="flex flex-col">
				<h3 class="font-bold text-xl">{feature}</h3>
				<p>{features[feature]}</p>
			</div>
		{/each}
	</section>
</Wrapper>
