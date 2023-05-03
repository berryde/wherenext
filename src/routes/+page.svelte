<script>
	import Title from '$components/title.svelte';
	import Subtitle from '$components/subtitle.svelte';
	import Link from '$components/nav-link.svelte';
	import Wrapper from '$components/wrapper.svelte';
	import usa from '$lib/assets/usa.png';
</script>

<Wrapper menubar={false}>
	<Title>WhereNext</Title>
	<Subtitle>
		Where's next? We help you choose your next location in the U.S. according to your needs with
		just a few clicks
	</Subtitle>
	<img src={usa} alt="choropleth map of the USA" />
	<Link href="/weights">Get started</Link>
</Wrapper>
