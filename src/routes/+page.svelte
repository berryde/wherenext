<script>
	import Title from '$components/title.svelte';
	import Subtitle from '$components/subtitle.svelte';
	import Link from '$components/nav-link.svelte';
	import Wrapper from '$components/wrapper.svelte';
	import usa from '$lib/assets/usa.png';
</script>

<Wrapper menubar={false}>
	<Title>County Mapper</Title>
	<Subtitle>
		Find great US counties to live in based on a wide range of social, economic and environmental
		factors.
	</Subtitle>
	<img src={usa} alt="choropleth map of the USA" />
	<Link href="/weights">Get started</Link>
</Wrapper>
