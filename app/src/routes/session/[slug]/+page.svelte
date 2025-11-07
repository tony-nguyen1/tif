<script lang="ts">
	import type { PageServerData } from '../../session/[slug]/$types';

	let { data }: { data: PageServerData } = $props();
	console.log(data.lastExercise);
	// console.log(data.cleanMap);
</script>

<header>
	<h1 class="text-5xl">
		Workout ({data.trainingSessionInfo.id})
	</h1>
</header>

<!-- <p>{data.trainingSessionInfo.duration}</p>

<p>{data.trainingSessionInfo.place}</p>

<p>{data.trainingSessionInfo.formattedDateFromNow}</p> -->
<section>
	<h2 class="text-2xl">Add a set</h2>
	<form method="POST" action="?/addASet" class="grid gap-2">
		<div class="grid gap-1">
			<label for="exerciseId" class="text-sm">The exercise : </label>
			<select
				name="exerciseId"
				id="exercise"
				class="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
				required
			>
				<option></option>
				{#each data.userExercise as anExercise (anExercise.id)}
					<option value={anExercise.id} selected={anExercise.id === data.lastExercise}
						>{anExercise.name}</option
					>
				{/each}
			</select>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="grid w-full gap-1">
				<label for="rep" class="w-full text-sm">Number of rep :</label>
				<input
					id="rep"
					type="number"
					name="rep"
					step=".5"
					class="w-full rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
				/>
			</div>

			<div class="grid w-full">
				<label for="weight" class="w-fit text-sm"> Weight used : </label>
				<input
					name="weight"
					autocomplete="off"
					type="number"
					step=".25"
					class="w-full rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
				/>
			</div>
		</div>

		<div class="grid gap-1">
			<label for="rir" class="text-sm"> Repetition in reserve : </label>
			<input
				name="rir"
				autocomplete="off"
				type="number"
				class="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
			/>
		</div>

		<div class="grid gap-1">
			<label for="comment" class="text-sm"> Remark : </label>
			<input
				name="comment"
				autocomplete="off"
				type="text"
				class="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
			/>
		</div>
		<input name="userId" value={data.user.id} hidden />
		<input name="trainingSessionId" value={data.trainingSessionInfo.id} hidden />

		<button
			class="w-fit justify-self-end rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
			>Send</button
		>
	</form>
</section>

{#each data.cleanMap.keys() as exerciseId (exerciseId)}
	{data.exerciseIdToNameMap.get(exerciseId)} Vtotal={data.volumeMap.get(exerciseId)!}
	<br />
	{#each data.cleanMap.get(exerciseId) as aSet (aSet.id)}
		{aSet.repNumber}x{aSet.weight}kg, ({aSet.repInReserve})
		{aSet.comment}
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
