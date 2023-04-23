<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let type: 'button' | 'submit' | 'reset' | null = 'button';
	export let disabled = false;

	function handleClick() {
		dispatch('click');
	}
</script>

<button
	{type}
	{disabled}
	class="px-4 py-2 bg-sky-600 hover:bg-sky-800 font-bold transition-colors rounded text-neutral-50"
	on:click={handleClick}
>
	<slot />
</button>
