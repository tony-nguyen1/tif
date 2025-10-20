<script lang="ts">
	// import type { PageServerData } from './$types';
	import type { PageServerData } from '../../session/[slug]/$types';

	let { data }: { data: PageServerData } = $props();
	// console.log(data);
	// console.log(data.userExercise);
</script>

<br />
Details ({data.trainingSessionId})
<!-- <p>{data.trainingSessionInfo.date}</p> -->
<form method="POST" action="?/modifyDuration">
	<label>
		Update duration :
		<input name="newDuration" autocomplete="off" type="number" />
	</label>

	<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>Change</button
	>
</form>
<p>{data.trainingSessionInfo.duration}</p>
<form method="POST" action="?/modifyPlace">
	<label>
		Change place :
		<input name="newPlace" autocomplete="off" type="text" />
	</label>

	<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>Change</button
	>
</form>
<p>{data.trainingSessionInfo.place}</p>

<p>{data.test}</p>

<form method="POST" action="?/addASet">
	<label for="exerciseId">The exercise : </label>
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

<br /> <br />
{#each data.cleanMap.keys() as exerciseName, i}
	<p>
		{exerciseName}
		<br />
		{#each data.cleanMap.get(exerciseName) as aze, i}
			{aze.repNumber}x{aze.weight}kg, ({aze.repInReserve})
			{aze.remark}
			<br />
		{/each}
		<br />
	</p>
{/each}

<form method="POST" action="?/modifyPlace">
	<button class="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
		>Delete</button
	>
</form>
