<script lang="ts">
	import chroma from 'chroma-js';
	import type { Color } from 'chroma-js';

	export let fill: Color;

	function getTextColour() {
		const c = chroma(fill);
		if (c.luminance() > 0.5) {
			return '#000000';
		}
		return '#ffffff';
	}
</script>

<div
	class="text-xs md:text-sm rounded border max-w-[20rem] text-ellipsis line-clamp-1 px-5 font-bold text-neutral-100 py-1"
	style="background-color: {fill}; color: {getTextColour()}"
>
	<slot />
</div>
