<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1>Profile</h1>
<h2>Hi, {data.user.username}!</h2>
<p>Your user ID is {data.user.id}.</p>
<p>Training session:</p>
{#each data.trainingSessionData as aTrainingSession, i}
	<p>{aTrainingSession.id}</p>
	<p>{aTrainingSession.place}</p>
	<p>{aTrainingSession.date}</p>
	<p>{aTrainingSession.duration}</p>
	<!-- <form method="post" action="?/change">
		<input name="aTrainingSessionId" type="number" value={aTrainingSession.id} hidden />
		<button>Go to another page</button>
	</form> -->
	<a href={'/session/' + aTrainingSession.id}>Details</a>
	<br />
{/each}
<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
</form>

<form method="POST" action="?/foo">
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

	<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>Send</button
	>
</form>
