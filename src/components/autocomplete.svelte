<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let options: string[];
	export let value: string | undefined = undefined;
	export let placeholder: string = '';

	const dispatch = createEventDispatcher();

	function getMatches(input: string, n: number) {
		return options
			.filter((option) => option.toLowerCase().includes(input.toLowerCase()))
			.slice(0, n);
	}

	function handleInput(
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		const input = (event.target as HTMLInputElement).value;
		matches = getMatches(input, 10);
	}

	function selectMatch(match: string) {
		value = match;
		matches = [];
		dispatch('select', match);
	}

	let matches: string[] = [];
</script>

<!-- A text input with dropdowns that autocomplete -->
<div class="space-y-2 w-full flex flex-col items-end relative">
	<input
		{placeholder}
		bind:value
		class="px-2 border-neutral-300 border p-1 rounded w-full h-full"
		type="text"
		on:input={handleInput}
	/>
	{#if matches.length > 0}
		<ul class="absolute top-7 border bg-white w-full rounded">
			{#each matches as match}
				<li
					class="hover:bg-neutral-200 border-y transition-colors px-2 py-0.5"
					on:keypress={() => selectMatch(match)}
					on:click={() => selectMatch(match)}
				>
					{match}
				</li>
			{/each}
		</ul>
	{/if}
</div>
