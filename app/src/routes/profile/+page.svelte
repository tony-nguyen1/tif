<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1>Profile</h1>
<h2>Hi, {data.user.username}! ({data.user.id})</h2>
<br />
<a href={'profile/exercise/'}>My exercises</a>
<form method="post" action="?/createNewTrainingSession">
	<input name="userId" value={data.user.id} hidden />
	<button>Begin new training session</button>
</form>
<form method="POST" action="?/exercise">
	<label>
		Name of the exercise
		<input name="name" autocomplete="off" type="text" />
	</label>

	<input name="userId" value={data.user.id} hidden />

	<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>Create</button
	>
</form>
<br />
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
<br />
<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
</form>
