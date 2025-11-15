<script lang="ts">
	// import WorkoutForm from '$lib/components/custom/form/WorkoutForm.svelte';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';

	let value = today(getLocalTimeZone());
</script>

<h1 class="text-5xl">Sleep</h1>
<section class="mt-2 grid">
	<Calendar
		type="single"
		bind:value
		class="w-fit justify-self-center rounded-md border shadow-sm"
		captionLayout="dropdown"
	/>
	<br />
	<p>{value}</p>
</section>
