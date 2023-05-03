<script>
	import Title from '$components/title.svelte';
	import Subtitle from '$components/subtitle.svelte';
	import Link from '$components/nav-link.svelte';
	import Wrapper from '$components/wrapper.svelte';
	import examples from '$lib/assets/examples.png';
</script>

<Wrapper menubar={false}>
	<div class="py-10 md:py-20">
		<Title>WhereNext</Title>
		<Subtitle>
			Where's next? We help you choose your next location in the U.S. according to your needs with
			just a few clicks
		</Subtitle>
		<Link href="/weights">Get started</Link>
		<img
			src={examples}
			alt="screenshots of the application"
			class="px-5 md:max-w-3xl mx-auto py-5 md:py-10"
		/>
	</div>
</Wrapper>
