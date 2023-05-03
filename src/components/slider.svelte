<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let value = 0;
	export let min = 0;
	export let max = 100;
	export let step = 1;
	export let id: string | null = null;
	export let name: string | null = null;

	export let variant: 'weight' | 'basic' = 'weight';

	function getStyle() {
		switch (variant) {
			case 'weight':
				return 'bg-gradient-to-r from-red-500 via-neutral-200 to-emerald-500';
			case 'basic':
			default:
				return 'bg-gradient-to-r from-neutral-200 to-neutral-200';
		}
	}

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		value = parseInt(target.value);
		dispatch('change', target.value);
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = parseInt(target.value);
		dispatch('input', target.value);
	}
</script>

<div class="{getStyle()} border rounded flex items-center">
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
		class="h-full w-full rounded-full accent-slate-800 appearance-none outline-none bg-transparent transition-colors"
	/>
</div>
