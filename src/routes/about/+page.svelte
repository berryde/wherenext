<script lang="ts">
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
	<div class="space-y-4">
		<section class="space-y-2 leading-5">
			<Title>About WhereNext</Title>
			<p>
				WhereNext is a web application that helps you find your next location in the U.S. according
				to your needs and preferences. We use a range of data sources covering economic, geographic
				and social factors to find great matches for you.
			</p>
			<p>
				If you have any questions or want more information, please <a
					class="text-sky-600"
					href="/about">get in touch</a
				>.
			</p>
		</section>

		<hr />
		<section class="space-y-4">
			<div>
				<Title>County features</Title>
				<p>
					Learn more about which features we use to help find matches for you, and what they mean.
				</p>
			</div>
			{#each Object.keys(features) as feature}
				<div class="flex flex-col">
					<h3 class="font-bold text-xl">{feature}</h3>
					<p>{features[feature]}</p>
				</div>
			{/each}
		</section>

		<hr />
		<p>
			This application has been developed at the University of Southampton as part of a group
			project for COMP6214 Open Data Innovation.
		</p>
	</div>
</Wrapper>
