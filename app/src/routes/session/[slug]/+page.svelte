<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	console.log(data);
</script>

<form method="POST" action="?/addASet">
	<label for="exerciseId">Choose an exercise :</label>
	<select name="exerciseId" id="exercise">
		{#each data.userExercise as anExercise, i}
			<option value={anExercise.id}>{anExercise.name}</option>
		{/each}
	</select>

	<label>
		Number of repetition :
		<input name="rep" autocomplete="off" type="number" />
	</label>

	<label>
		Weight used :
		<input name="weight" autocomplete="off" type="number" />
	</label>

	<label>
		Repetition in reserve :
		<input name="rir" autocomplete="off" type="number" />
	</label>

	<label>
		Remark :
		<input name="remark" autocomplete="off" type="text" />
	</label>

	<input name="userId" value={data.user.id} hidden />
	<input name="trainingSessionId" value={data.trainingSessionId} hidden />

	<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>Send</button
	>
</form>

Details
{data.trainingSessionId}
{#each data.sets as aSet, i}
	<p>
		<!-- fix ugly condition -->
		{data.exerciseMap.get(aSet?.exercise ? aSet?.exercise : -1)} <br />
		{aSet?.repNumber}x{aSet?.weight}kg <br />
		{aSet?.repInReserve} <br />
		Rq: {aSet?.remark}
	</p>
{/each}
