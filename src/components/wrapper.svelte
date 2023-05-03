<script>
	import { page } from '$app/stores';
	import TabBar from './tab-bar.svelte';

	export let menubar = true;
	export let margins = true;
</script>

<main
	class="flex flex-col min-h-full md:flex-row-reverse md:justify-end h-screen w-full bg-neutral-50 text-neutral-900"
>
	<section class="flex justify-center overflow-auto h-full md:mx-auto flex-grow">
		<div class="{margins ? 'max-w-2xl md:pt-8 p-4 ' : 'w-full'} space-y-4 h-full">
			<slot />
			<div class="w-full h-4" />
		</div>
	</section>
	{#if menubar}
		<TabBar selected={$page.route.id} />
	{/if}
</main>
