<script>
	import Title from '$components/title.svelte';
	import Subtitle from '$components/subtitle.svelte';
	import Button from '$components/button.svelte';
	import Link from '$components/nav-link.svelte';
</script>

<main class="h-screen w-full p-12 bg-neutral-50 text-neutral-900">
	<section class="max-w-2xl mx-auto space-y-5">
		<Title>County Mapper</Title>
		<Subtitle>
			Find great US counties to live in based on a wide range of social, economic and environmental
			factors.
		</Subtitle>
		<img src="images/usa.png" alt="choropleth map of the USA" />
		<Link href="/weights">Get started</Link>
	</section>
</main>
