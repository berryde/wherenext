<script lang="ts">
	// slider
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let value = 0;
	export let min = 0;
	export let max = 100;
	export let step = 1;
	export let id: string | null = null;
	export let name: string | null = null;

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		dispatch('change', +target.value);
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		dispatch('input', +target.value);
	}
</script>

<input
	{id}
	{name}
	type="range"
	{value}
	{min}
	{max}
	{step}
	on:change={handleChange}
	on:input={handleInput}
	class="accent-sky-600"
/>
