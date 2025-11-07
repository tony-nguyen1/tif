<script lang="ts">
	// import type { PageServerData } from './$types';
	import type { PageServerData } from '../../../session/[slug]/editMode/$types';
	// import type { PageServerData } from

	let { data }: { data: PageServerData } = $props();
</script>

<br />
Details ({data.trainingSessionId})
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

<br /> <br />
{#each data.cleanMap.keys() as exerciseName, i}
	{exerciseName} Vtotal={data.volumeMap.get(exerciseName)!}
	<br />
	{#each data.cleanMap.get(exerciseName) as aze, i}
		{aze.repNumber}x{aze.weight}kg, ({aze.repInReserve})
		{aze.comment}
		<form method="POST" action="?/updateSet">
			<label for="exerciseId">The exercise : </label>
			<select name="exerciseId" id="exercise">
				{#each data.userExercise as anExercise, i}
					<option
						value={anExercise.id}
						selected={anExercise.id === data.exerciseNameToExerciseIdMap.get(exerciseName)}
						>{anExercise.name}</option
					>
				{/each}
			</select>
			<label>
				Number of repetition :
				<input name="rep" value={aze.repInReserve} autocomplete="off" type="number" />
			</label>

			<label>
				Weight used :
				<input name="weight" value={aze.weight} autocomplete="off" type="number" />
			</label>

			<label>
				Repetition in reserve :
				<input name="rir" value={aze.repInReserve} autocomplete="off" type="number" />
			</label>

			<label>
				Remark :
				<input name="comment" autocomplete="off" value={aze.comment} type="text" />
			</label>

			<input name="gymSetId" value={aze.id} hidden />
			<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
				>Update</button
			>
		</form>
		<form method="POST" action="?/deleteSet">
			<input name="gymSetId" value={aze.id} hidden />
			<button class="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
				>Delete this set</button
			>
		</form>
		<br />
	{/each}
	<br />
{/each}

<form method="POST" action="?/delete">
	<input name="trainingSessionId" value={data.trainingSessionId} hidden />
	<button class="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
		>Delete this training session</button
	>
</form>

<br />
<!-- How to do floating label above input -->
<!-- https://douiri.org/blog/css-floating-label/#why-floating-labels -->
