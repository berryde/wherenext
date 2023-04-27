<script lang="ts">
	import Icon from '@iconify/svelte';

	export let selected: string | null;
	const tabs = [
		{ name: 'About', href: '/about', icon: 'ion:information-circle' },
		{ name: 'Weights', href: '/weights', icon: 'ion:options' },
		{ name: 'Map', href: '/map', icon: 'ion:map' },
		{ name: 'Saved', href: '/saved', icon: 'ion:bookmark' },
		{ name: 'Compare', href: '/compare', icon: 'ion:contrast' }
	];
</script>

<div
	class="py-3 md:py-0 md:w-auto md:h-screen w-full md:max-w-min md:bottom-auto border-t md:border-t-0 md:top-0 md:border-r bg-neutral-50 border-neutral-400"
>
	<div
		class="flex md:flex-col items-center justify-center md:space-x-0 md:space-y-8 md:px-4 md:pt-8 space-x-8"
	>
		{#each tabs as tab}
			<a
				href={tab.href}
				class="text-lg outline-none {selected === tab.href
					? 'text-sky-600'
					: 'text-neutral-600'} font-bold space-x-2 hover:text-sky-800 transition-colors"
			>
				<div class="flex flex-col justify-center items-center">
					<Icon icon={tab.icon} width="2rem" />
					<p class="text-xs">{tab.name}</p>
				</div>
			</a>
		{/each}
	</div>
</div>
