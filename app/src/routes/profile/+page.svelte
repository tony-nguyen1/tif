<script lang="ts">
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';
	import type { PageServerData } from './$types';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	let { data }: { data: PageServerData } = $props();
</script>

<header class="grid grid-cols-2">
	<h1 class="text-5xl">Profile</h1>
	<aside class="justify-self-end text-right">
		<h2 class="text-xs">connected as {data.user.username}</h2>
		<h2 class="text-xs">{data.user.id}</h2>
		<form method="post" action="?/logout" use:enhance>
			<button class="text-sm text-red-400">Log out</button>
		</form>
	</aside>
</header>
<section class="grid place-items-center gap-y-3">
	<a
		href={'profile/exercise/'}
		class="rounded-md bg-blue-800 px-4 py-2 text-white transition hover:bg-blue-900"
	>
		My exercises
	</a>
	<form method="post" action="?/createNewTrainingSession">
		<input name="userId" value={data.user.id} hidden />
		<button class="rounded-md bg-blue-800 px-4 py-2 text-white transition hover:bg-blue-900"
			>Begin new training session</button
		>
	</form>
</section>

<section>
	<h2 class="text-3xl">Past workout</h2>
	<div class="flex flex-col gap-3">
		{#each data.trainingSessionData as aTrainingSession, i}
			<article>
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
			</article>
		{/each}
	</div>
</section>
