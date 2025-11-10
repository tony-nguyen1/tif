<script lang="ts">
	// TODO : true error handling and redirection to error page
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import SolarPen2Linear from '@iconify-svelte/solar/pen-2-linear';
	import SolarCloseSquareLineDuotone from '@iconify-svelte/solar/close-square-line-duotone';
	import { resolve } from '$app/paths';
	import { FormState } from './myEnum';
	import { type Set } from '$lib/server/db/schema';

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
			this.formState = FormState.Edit;
			this.setState = getASet();
			this.selectedExerciseId = getASet().exerciseId;
			console.log(this.selectedExerciseId);
		}

		mutateFormDisplayState() {
			switch (this.formState) {
				case FormState.Display:
					this.formState = FormState.Hide;
					break;
				case FormState.Edit:
					this.formState = FormState.Display;
					this.selectedExerciseId = this.lastExerciseId;
					break;
				case FormState.Hide:
					this.formState = FormState.Display;
					break;
			}
		}
	}

	let { data }: PageProps = $props();

	let formDisplayStateValue: FormStateUnion = $state(new FormStateUnion(data.lastExercise));
</script>

<header>
	<h1 class="text-5xl">
		Workout ({data.trainingSessionInfo.id})
	</h1>
</header>

<!-- <p>{data.trainingSessionInfo.duration}</p>

<p>{data.trainingSessionInfo.place}</p>

<p>{data.trainingSessionInfo.formattedDateFromNow}</p> -->
{#if formDisplayStateValue.formState === FormState.Display || formDisplayStateValue.formState === FormState.Edit}
	<section id="addSetForm">
		<header class="grid grid-cols-2">
			<h2 class="text-2xl">
				{formDisplayStateValue.formState === FormState.Display ? 'Add' : 'Update'} a set
			</h2>
			<button
				class="size-fit cursor-pointer self-center justify-self-end rounded-sm bg-slate-800 px-2 py-1 text-xs"
				onclick={() => formDisplayStateValue.mutateFormDisplayState()}
			>
				{formDisplayStateValue.formState === FormState.Display
					? FormState[FormState.Hide]
					: FormState[FormState.Display]} form
			</button>
		</header>
		<form
			method="POST"
			action={formDisplayStateValue.formState === FormState.Display ? '?/addASet' : '?/editASet'}
			class="grid gap-2"
			use:enhance
		>
			<div class="grid gap-1">
				<label for="exerciseId" class="text-sm">The exercise : </label>
				<select
					name="exerciseId"
					id="exercise"
					bind:value={formDisplayStateValue.selectedExerciseId}
					class="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
					required
					disabled={formDisplayStateValue.formState === FormState.Edit}
				>
					<option value={-1}>Choose an exercise</option>
					{#each data.userExercise as anExercise (anExercise.id)}
						<option value={anExercise.id}>
							{anExercise.name}
						</option>
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
						min="0"
						placeholder="8"
						value={formDisplayStateValue.formState === FormState.Edit
							? formDisplayStateValue.setState?.repNumber
							: null}
						class="w-full rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
					/>
				</div>

				<div class="grid w-full">
					<label for="weight" class="w-fit text-sm"> Weight used : </label>
					<input
						name="weight"
						autocomplete="off"
						type="number"
						step=".125"
						min="0"
						placeholder="12.5"
						value={formDisplayStateValue.formState === FormState.Edit
							? formDisplayStateValue.setState?.weight
							: null}
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
					min="0"
					max="10"
					placeholder="2"
					value={formDisplayStateValue.formState === FormState.Edit
						? formDisplayStateValue.setState?.repInReserve
						: null}
					class="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
				/>
			</div>

			<div class="grid gap-1">
				<label for="comment" class="text-sm"> Remark : </label>
				<input
					name="comment"
					autocomplete="off"
					type="text"
					placeholder="Good range of motion"
					value={formDisplayStateValue.formState === FormState.Edit
						? formDisplayStateValue.setState?.comment
						: null}
					class="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
				/>
			</div>
			<input name="userId" bind:value={data.user.id} hidden />
			<input name="trainingSessionId" bind:value={data.trainingSessionInfo.id} hidden />

			{#if formDisplayStateValue.formState === FormState.Edit}
				<input name="setId" value={formDisplayStateValue.setState!.id} hidden />
				<input name="comment" value={formDisplayStateValue.setState!.comment} hidden />
				<!-- <input name="volume" value={formDisplayStateValue.setState!.volume} hidden /> -->
				<input name="exerciseId" value={formDisplayStateValue.setState!.exerciseId} hidden />
			{/if}

			<button
				class="w-fit justify-self-end rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
			>
				Send
			</button>
		</form>
	</section>
{:else}
	<button
		class="size-fit cursor-pointer place-self-center rounded-sm bg-slate-800 px-2 py-1 text-xs"
		onclick={() => formDisplayStateValue.mutateFormDisplayState()}
	>
		{FormState[FormState.Display]} form
	</button>
{/if}

<section id="setLOfWorkoutist">
	{#each data.cleanMap.keys() as exerciseId (exerciseId)}
		<article>
			<header>
				<div class="flex flex-row">
					<h2 class="text-3xl">
						<a
							href={resolve('/(connected)/profile/exercise/[slug]', {
								slug: exerciseId.toString()
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
						<span class="max-h-[1rem] min-h-[1rem] text-xs text-slate-400">{aSet.comment}</span>
					</div>
					<div>{aSet.repInReserve} RIR</div>
					<div class="flex flex-row gap-x-2">
						<!-- bg-amber-700 -->
						<button
							onclick={() => {
								formDisplayStateValue.edit(() => aSet);
							}}
							class="size-min cursor-pointer rounded-xs bg-amber-700 p-1 text-white transition hover:bg-amber-800"
							><SolarPen2Linear class="size-[24px]" /></button
						>
						<form method="POST" action="?/deleteSet" class="size-min" use:enhance>
							<input name="gymSetId" value={aSet.id} hidden />
							<button
								class="cursor-pointer rounded-xs bg-red-600 p-1 text-white transition hover:bg-red-700"
								><SolarCloseSquareLineDuotone class="size-[24px]" /></button
							>
						</form>
					</div>
				</li>
			{/each}
			<br />
		</article>
	{/each}
</section>

<form method="POST" action="?/delete">
	<input name="trainingSessionId" value={data.trainingSessionInfo.id} hidden />
	<button class="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
		>Delete this training session</button
	>
</form>
