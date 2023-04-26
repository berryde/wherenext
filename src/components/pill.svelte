<script>
	export let fill = '#1da1f2';

	function getTextColour() {
		if (fill[0] == '#') {
			const hex = fill.substring(1);
			const r = parseInt(hex.substring(0, 2), 16);
			const g = parseInt(hex.substring(2, 4), 16);
			const b = parseInt(hex.substring(4, 6), 16);

			const brightness = (r * 299 + g * 587 + b * 114) / 1000;

			return brightness > 155 ? '#000000' : '#ffffff';
		} else if (fill.startsWith('rgb')) {
			const rgb = fill
				.substring(4, fill.length - 1)
				.replace(/ /g, '')
				.split(',');

			const r = parseInt(rgb[0]);
			const g = parseInt(rgb[1]);
			const b = parseInt(rgb[2]);

			const brightness = (r * 299 + g * 587 + b * 114) / 1000;

			return brightness > 155 ? '#000000' : '#ffffff';
		}
		return '#ffffff';
	}
</script>

<div
	class="text-sm rounded max-w-[20rem] text-ellipsis line-clamp-1 px-5 font-bold text-neutral-100 py-1"
	style="background-color: {fill}; color: {getTextColour()}"
>
	<slot />
</div>
