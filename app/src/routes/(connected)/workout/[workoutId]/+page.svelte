<script lang="ts">
	// TODO : true error handling and redirection to error page
	import { enhance } from '$app/forms';
	// import type { PageServerData } from '../../../(connected)/profile/exercise/[exerciseId]/$types';
	import type { PageProps } from './$types';
	import SolarPen2Linear from '@iconify-svelte/solar/pen-2-linear';
	import SolarCloseSquareLineDuotone from '@iconify-svelte/solar/close-square-line-duotone';
	import { resolve } from '$app/paths';
	import { FormState } from '$lib/components/custom/form/myEnum';
	import { type Set } from '$lib/server/db/schema';
	import WorkoutForm from '$lib/components/custom/form/WorkoutForm.svelte';

	class FormStateUnion {
		formState: FormState;
		setState: Set | null;
		selectedExerciseId: number;
		lastExerciseId: number;

		constructor(n: number) {
			this.formState = $state(FormState.Display);
			this.setState = $state(null);
			this.selectedExerciseId = $state(n);
			this.lastExerciseId = $state(n);
		}

		edit(getASet: () => Set) {
			this.formState = FormState.EditSet;
			this.setState = getASet();
			this.selectedExerciseId = getASet().exerciseId;
			console.log(this.selectedExerciseId);
		}

		mutateFormDisplayStateTo(newSate: FormState) {
			if (this.formState === FormState.EditSet) {
				// in the state EditSet, the exercice selected is modified, so we need to revert it back
				this.selectedExerciseId = this.lastExerciseId;
			}
			this.formState = newSate;
		}
	}

	let { data }: PageProps = $props();

	let formDisplayStateValue: FormStateUnion = $state(new FormStateUnion(data.lastExercise));
	// let formOptionsAuthorized: Array<boolean | undefined> = data.formOptionsAuthorized;
</script>

<header>
	<h1 class="text-5xl">
		Workout ({data.trainingSessionInfo.id})
	</h1>
</header>

<WorkoutForm {...data} {formDisplayStateValue} />

<section id="setLOfWorkoutist">
	{#each data.cleanMap.keys() as exerciseId (exerciseId)}
		<article>
			<header>
				<div class="flex flex-row">
					<h2 class="text-3xl">
						<a
							href={resolve('/(connected)/exercise/[exerciseId]', {
								exerciseId: exerciseId.toString()
							})}>{data.exerciseIdToNameMap.get(exerciseId)}</a
						>
					</h2>
					<span class="grow self-center text-center text-sm"
						>V<sub>total</sub>={data.volumeMap.get(exerciseId)!}</span
					>
				</div>
				<!-- <p class="text-sm text-slate-400">{data.trainingSessionInfo.comment} {data.cleanMap.get(exerciseId)}</p> -->
			</header>
			{#each data.cleanMap.get(exerciseId) as aSet (aSet.id)}
				<li class="grid grid-cols-(--custom-col-pattern)">
					<div class="flex flex-col">
						<span class="text-base">{aSet.repNumber}x{aSet.weight}kg</span>
						<span class="max-h-[1rem] min-h-[1rem] text-xs text-slate-600 dark:text-slate-400">
							{aSet.comment}
						</span>
					</div>
					<div>
						{#if aSet.repInReserve > -1}
							{aSet.repInReserve} RIR
						{/if}
					</div>
					<div class="flex flex-row gap-x-2">
						<button
							onclick={() => {
								formDisplayStateValue.edit(() => aSet);
							}}
							class="size-min cursor-pointer rounded-xs bg-amber-700 p-1 text-white transition hover:bg-amber-800"
						>
							<SolarPen2Linear class="size-[24px]" />
						</button>
						<form method="POST" action="?/deleteSet" class="size-min" use:enhance>
							<input name="gymSetId" value={aSet.id} hidden />
							<button
								onclick={() => {
									formDisplayStateValue.mutateFormDisplayStateTo(FormState.Display);
								}}
								class="cursor-pointer rounded-xs bg-red-600 p-1 text-white transition hover:bg-red-700"
							>
								<SolarCloseSquareLineDuotone class="size-[24px]" />
							</button>
						</form>
					</div>
				</li>
			{/each}
			<br />
		</article>
	{/each}
</section>

<form method="POST" action="?/deleteWorkout" class="justify-self-center">
	<input name="trainingSessionId" value={data.trainingSessionInfo.id} hidden />
	<button class="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700">
		Delete this training session
	</button>
</form>
