<script>
	import { page } from '$app/stores';
	import TabBar from './tab-bar.svelte';

	export let menubar = true;
	export let margins = true;
	export let padding = true;
</script>

<main
	class="flex flex-col absolute inset-0 md:flex-row-reverse md:justify-end h-screen w-full bg-neutral-50 text-neutral-900"
>
	<section
		class="flex flex-col {padding && 'p-4'} h-full space-y-4 overflow-auto w-full items-center"
	>
		<div class="space-y-4 {margins ? 'max-w-2xl' : 'w-full'} {padding ? 'h-fit' : 'h-full'}">
			<slot />
		</div>
	</section>
	{#if menubar}
		<TabBar selected={$page.route.id} />
	{/if}
</main>
