<script lang="ts">
	import type { WorkoutOfUserResult } from '$lib/server/db/workoutRepo';

	interface Props {
		workoutData: WorkoutOfUserResult;
	}
	let { workoutData }: Props = $props();

	// function convertToNameOftheDay(d: Date) {
	// 	return d.toLocaleDateString('en-US', {
	// 		weekday: 'long'
	// 	});
	// }
</script>

<h2 class="text-2xl">Workout overview</h2>
<ol>
	{#each workoutData as aWorkout (aWorkout.exerciseId)}
		<li class="pl-8 text-lg">
			{aWorkout.exerciseName} : {aWorkout.numberbOfSet}
			{aWorkout.numberbOfSet > 1 ? 'sets' : 'set'}
		</li>
	{/each}
</ol>
