<script lang="ts">
	import Icon from '@iconify/svelte';

	export let stars: number;

	$: full = new Array(Math.round(Math.max(0, Math.min(5, stars))));
	$: empty = new Array(5 - full.length);
</script>

<div class="flex items-center text-sky-600 text-xs">
	{#each full as _, index}
		<Icon icon="ph:star-fill" />
	{/each}
	{#each empty as _, index}
		<Icon icon="ph:star" />
	{/each}
</div>
