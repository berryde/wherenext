<script lang="ts">
	import { page } from '$app/stores';
	import type { County } from '$lib/domain/county';
	import type { PageData } from './$types';
	export let data: PageData;

	const county = data.county as County;
</script>

{JSON.stringify(data)}
