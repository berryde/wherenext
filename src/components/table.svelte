<script lang="ts">
	export let headers: string[];
</script>

<table class="w-full table-auto">
	<thead class="border">
		<tr class="border">
			{#each headers as header}
				<th class="border"> {header} </th>
			{/each}
		</tr>
	</thead>
	<tbody>
		<slot />
	</tbody>
</table>
