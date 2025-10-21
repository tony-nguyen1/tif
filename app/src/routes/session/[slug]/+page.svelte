<script lang="ts">
	import type { PageServerData } from '../../session/[slug]/$types';

	let { data }: { data: PageServerData } = $props();
	console.log(data);
</script>

<br />
Details ({data.trainingSessionInfo.id})

<p>{data.trainingSessionInfo.duration}</p>

<p>{data.trainingSessionInfo.place}</p>

<p>{data.trainingSessionInfo.formattedDateFromNow}</p>

<form method="POST" action="?/addASet">
	<label for="exerciseId">The exercise : </label>
	<select name="exerciseId" id="exercise" required>
		<option></option>
		{#each data.userExercise as anExercise, i}
			<option value={anExercise.id} selected={anExercise.id === data.lastExercise}
				>{anExercise.name}</option
			>
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
	<input name="trainingSessionId" value={data.trainingSessionInfo.id} hidden />

	<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>Send</button
	>
</form>

<br /> <br />
{#each data.cleanMap.keys() as exerciseId}
	{data.exerciseIdToNameMap.get(exerciseId)} Vtotal={data.volumeMap.get(exerciseId)!}
	<br />
	{#each data.cleanMap.get(exerciseId) as aSet, i}
		{aSet.repNumber}x{aSet.weight}kg, ({aSet.repInReserve})
		{aSet.remark}
		<form method="POST" action="?/deleteSet">
			<input name="gymSetId" value={aSet.id} hidden />
			<button class="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
				>Delete this set</button
			>
		</form>
		<br />
	{/each}
	<br />
{/each}

<form method="POST" action="?/delete">
	<input name="trainingSessionId" value={data.trainingSessionInfo.id} hidden />
	<button class="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
		>Delete this training session</button
	>
</form>

<br />
