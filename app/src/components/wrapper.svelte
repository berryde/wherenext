<script>
	import { page } from '$app/stores';
	import TabBar from './tab-bar.svelte';
</script>

<main class="h-screen w-full md:pl-28 p-12 bg-neutral-50 text-neutral-900">
	<section class="max-w-2xl mx-auto space-y-8">
		<slot />
	</section>
	<TabBar selected={$page.route.id} />
</main>
