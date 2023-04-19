<script lang="ts">
	import Icon from '@iconify/svelte';

	export let href: string = '#';
</script>

<a
	{href}
	class="flex text-lg items-center outline-none text-sky-600 font-bold space-x-2 hover:text-sky-800 transition-colors"
>
	<slot />
	<Icon icon="ion:arrow-forward" inline={true} width="1.5rem" />
</a>
