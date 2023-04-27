<script lang="ts">
	export let data: (string | number)[];
	export let leadingWidth = 'w-1/2';
</script>

<tr>
	<td class="p-1 border text-center {leadingWidth}"> {data[0]} </td>
	{#each data.slice(1) as d}
		<td class="p-1 border text-center"> {d} </td>
	{/each}
</tr>
