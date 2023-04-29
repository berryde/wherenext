<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let type: 'button' | 'submit' | 'reset' | null = 'button';
	export let disabled = false;
	export let variant: 'primary' | 'danger' = 'primary';

	function getStyle() {
		switch (variant) {
			case 'danger':
				return 'border text-red-600 border-red-600 hover:bg-red-600 hover:text-white';
			case 'primary':
			default:
				return 'bg-sky-600 hover:bg-sky-800';
		}
	}

	function handleClick() {
		dispatch('click');
	}
</script>

<button
	{type}
	{disabled}
	class="px-4 py-2 {getStyle()} font-bold transition-colors rounded text-neutral-50"
	on:click={handleClick}
>
	<slot />
</button>
