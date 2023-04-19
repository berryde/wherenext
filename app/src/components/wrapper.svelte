<script>
	import { page } from '$app/stores';
	import TabBar from './tab-bar.svelte';
</script>

<main
	class="flex flex-col md:flex-row-reverse md:justify-end h-screen w-full bg-neutral-50 text-neutral-900"
>
	<section class="max-w-2xl h-full md:mx-auto flex-grow overflow-auto space-y-8 p-12">
		<slot />
	</section>
	<TabBar selected={$page.route.id} />
</main>
