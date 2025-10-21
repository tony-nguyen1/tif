<script lang="ts">
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';
	import type { PageServerData } from './$types';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

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

<br />
<p>Training session:</p>
{#each data.trainingSessionData as aTrainingSession, i}
	<!-- <p>{aTrainingSession.id}</p> -->
	<p>At {aTrainingSession.place}</p>
	<p>{dayjs(aTrainingSession.date).fromNow()} during {aTrainingSession.duration} minutes</p>
	<!-- <form method="post" action="?/change">
		<input name="aTrainingSessionId" type="number" value={aTrainingSession.id} hidden />
		<button>Go to another page</button>
	</form> -->
	<a href={'/session/' + aTrainingSession.id}>Details</a>
	<form method="post" action="?/deleteTrainingSession">
		<input name="trainingSessionId" value={aTrainingSession.id} hidden />
		<button class="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
			>Delete</button
		>
	</form>
	<br />
	<br />
{/each}
<br />
<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
</form>
