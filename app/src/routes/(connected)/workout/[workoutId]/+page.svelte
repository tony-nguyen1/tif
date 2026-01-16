<script lang="ts">
	// TODO : true error handling and redirection to error page
	// import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import { resolve } from '$app/paths';
	import WorkoutForm from '$lib/components/custom/form/WorkoutForm.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { FormStateUnion } from '$lib/components/custom/form/WorkoutFormState.svelte';

	const { data, form }: { data: PageServerData; form: ActionData } = $props();

	let formDisplayStateValue: FormStateUnion = $derived(new FormStateUnion(data.lastExercise));
</script>

<header>
	<h1 class="text-5xl">
		Workout ({data.trainingSessionInfo.id})
	</h1>
</header>

<WorkoutForm {...data} {form} bind:formDisplayStateValue />

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
						<span class="max-h-4 min-h-4 text-xs text-slate-600 dark:text-slate-400">
							{aSet.comment}
						</span>
					</div>
					<div>
						{#if aSet.repInReserve > -1}
							{aSet.repInReserve} RIR
						{/if}
					</div>
					<div class="flex flex-row gap-x-2">
						<!-- <button
							onclick={() => {
								formDisplayStateValue.edit(() => aSet);
							}}
							class="size-min cursor-pointer rounded-xs bg-amber-700 p-1 text-white transition hover:bg-amber-800"
						>
							<SolarPen2Linear class="size-6" />
						</button>
						<form method="POST" action="?/deleteSet" class="size-min" use:enhance>
							<input name="gymSetId" value={aSet.id} hidden />
							<button
								onclick={() => {
									formDisplayStateValue.mutateFormDisplayStateTo(FormState.AddSet);
								}}
								class="cursor-pointer rounded-xs bg-red-600 p-1 text-white transition hover:bg-red-700"
							>
								<SolarCloseSquareLineDuotone class="size-6" />
							</button>
						</form> -->
					</div>
				</li>
			{/each}
			<br />
		</article>
	{/each}
</section>

<form method="POST" action="?/deleteWorkout" class="justify-self-center">
	<input name="trainingSessionId" value={data.trainingSessionInfo.id} hidden />
	<Button variant="destructive" type="submit">Delete this training session</Button>
</form>
