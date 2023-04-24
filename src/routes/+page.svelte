<script>
	import Title from '$components/title.svelte';
	import Subtitle from '$components/subtitle.svelte';
	import Link from '$components/nav-link.svelte';
	import Wrapper from '$components/wrapper.svelte';
</script>

<Wrapper menubar={false}>
	<Title>County Mapper</Title>
	<Subtitle>
		Find great US counties to live in based on a wide range of social, economic and environmental
		factors.
	</Subtitle>
	<img src="images/usa.png" alt="choropleth map of the USA" />
	<Link href="/weights">Get started</Link>
</Wrapper>
