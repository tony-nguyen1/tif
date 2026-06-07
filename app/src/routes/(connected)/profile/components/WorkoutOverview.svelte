<script lang="ts">
	import type {
		ExerciseInfo,
		WorkoutOfUserGroupedByExercise,
		WorkoutOfUserGroupedByExerciseAndWorkout
	} from '$lib/server/db/workoutRepo';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button';
	import { DisplayGroupingPreference } from './customType';
	import { SvelteMap } from 'svelte/reactivity';

	interface Props {
		workoutDataSimple: WorkoutOfUserGroupedByExercise;
		workoutDataComplex: WorkoutOfUserGroupedByExerciseAndWorkout;
	}
	let { workoutDataSimple: workoutData, workoutDataComplex: workoutData2 }: Props = $props();

	function convertToNameOftheDay(d: Date) {
		return d.toLocaleDateString('en-US', {
			weekday: 'long'
		});
	}

	const myMap: SvelteMap<string, ExerciseInfo[]> = $derived.by(() => {
		const svelteMap: SvelteMap<string, ExerciseInfo[]> = new SvelteMap();
		for (const anExercise of workoutData2) {
			if (!svelteMap.has(convertToNameOftheDay(anExercise.date))) {
				svelteMap.set(convertToNameOftheDay(anExercise.date), []);
			}
			svelteMap.get(convertToNameOftheDay(anExercise.date))!.push(anExercise);
		}
		return svelteMap;
	});

	let groupingState: DisplayGroupingPreference = $state(DisplayGroupingPreference.PerWeek);
</script>

<h2 class="text-2xl">Workout overview</h2>
<ButtonGroup.Root>
	<Button
		variant={groupingState === DisplayGroupingPreference.PerWeek ? 'default' : 'outline'}
		class={[
			'size-fit px-2 py-1',
			groupingState === DisplayGroupingPreference.PerWeek ? 'cursor-not-allowed' : 'cursor-pointer'
		]}
		onclick={() => {
			groupingState = DisplayGroupingPreference.PerWeek;
		}}>Week</Button
	>
	<Button
		variant={groupingState === DisplayGroupingPreference.PerDay ? 'default' : 'outline'}
		class={[
			'size-fit px-2 py-1',
			groupingState === DisplayGroupingPreference.PerDay ? 'cursor-not-allowed' : 'cursor-pointer'
		]}
		onclick={() => {
			groupingState = DisplayGroupingPreference.PerDay;
		}}>Day</Button
	>
</ButtonGroup.Root>

<ol class="pl-8 text-lg">
	{#if groupingState == DisplayGroupingPreference.PerWeek}
		{#each workoutData as aWorkout (aWorkout.exerciseId)}
			<li class="">
				{aWorkout.exerciseName} : {aWorkout.numberbOfSet}
				{aWorkout.numberbOfSet > 1 ? 'sets' : 'set'}
			</li>
		{/each}
	{:else}
		{#each myMap as [dayOfTheWeek, exerciseInfoArray] (dayOfTheWeek)}
			<li>{dayOfTheWeek}</li>
			{#each exerciseInfoArray as anExerciseInfo ((anExerciseInfo.workoutId, anExerciseInfo.exerciseId))}
				<li class="pl-4">
					{anExerciseInfo.exerciseName} : {anExerciseInfo.numberbOfSet}
					{anExerciseInfo.numberbOfSet > 1 ? 'sets' : 'set'}
				</li>
			{/each}
		{/each}
	{/if}
</ol>
