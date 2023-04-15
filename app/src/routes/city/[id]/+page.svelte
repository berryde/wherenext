<script lang="ts">
	import { getDescription } from '$lib/api';
	import type { PageData } from './$types';

	export let data: PageData;
	let src: string;

	$: src = `https://source.unsplash.com/random/200x100/?${encodeURIComponent(data.city.name)}`;
</script>

<div class="w-full p-20">
	<div class="max-w-4xl mx-auto">
		<div class="flex flex-col space-y-5">
			<img {src} class="rounded bg-cover w-full" style="height: 100px;" alt={data.city.name} />
			<div>
				<h1 class="text-3xl">{data.city.name}</h1>
				<h3>
					Located in {data.city.country} |
					<a class="text-blue-600 cursor-pointer" href={data.city.wikidata}
						>Learn more via Wikidata</a
					>
				</h3>
			</div>

			<hr class="w-full" />
			<div class="flex flex-col space-y-0 w-full">
				{#each Object.keys(data.city.features) as feature}
					{#await getDescription(feature) then description}
						<span
							>{description.label}:
							<span class="">{data.city.features[feature].value}</span></span
						>
					{/await}
				{/each}
			</div>
			<hr class="w-full" />
			<p class="text-xl">Similar cities</p>
			<div class="flex flex-wrap gap-1 w-full">
				{#each data.similar as city}
					<div class="p-1 bg-gray-100 rounded">
						<a class="text-blue-600" href="/city/{city.id}">{city.name}</a>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
