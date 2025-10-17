<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	console.log(data);
</script>

Details
{data.trainingSessionId}
{#each data.sets as aSet, i}
	<p>
		{aSet?.exercise} <br />
		{aSet?.repNumber}x{aSet?.weight}kg <br />
		{aSet?.repInReserve} <br />
		Rq: {aSet?.remark}
	</p>
{/each}
