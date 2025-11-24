<script lang="ts">
	import { enhance } from '$app/forms';
	import { FormState } from './myEnum';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';

	let { userExercise, trainingSessionInfo, user, formDisplayStateValue, userTag, tagIds } =
		$props();
</script>

<ButtonGroup.Root id="buttonGroupWorkoutForm">
	<Button
		variant="outline"
		class={[
			'size-fit px-2 py-1',
			formDisplayStateValue.formState === FormState.Hide ? 'cursor-not-allowed' : 'cursor-pointer'
		]}
		onclick={() => formDisplayStateValue.mutateFormDisplayStateTo(FormState.Hide)}
	>
		Hide form
	</Button>
	<Button
		variant="outline"
		class={[
			'size-fit px-2 py-1',
			formDisplayStateValue.formState === FormState.AddSet ? 'cursor-not-allowed' : 'cursor-pointer'
		]}
		onclick={() => formDisplayStateValue.mutateFormDisplayStateTo(FormState.AddSet)}
	>
		Add set
	</Button>
	<Button
		variant="outline"
		class={[
			'size-fit px-2 py-1',
			formDisplayStateValue.formState === FormState.EditWorkoutInfo
				? 'cursor-not-allowed'
				: 'cursor-pointer'
		]}
		onclick={() => formDisplayStateValue.mutateFormDisplayStateTo(FormState.EditWorkoutInfo)}
	>
		Edit workout
	</Button>
	<Button
		variant="outline"
		class={[
			'size-fit px-2 py-1',
			formDisplayStateValue.formState === FormState.AddTag ? 'cursor-not-allowed' : 'cursor-pointer'
		]}
		onclick={() => {
			formDisplayStateValue.mutateFormDisplayStateTo(FormState.AddTag);
			console.info('hi');
		}}
	>
		Add tag
	</Button>
</ButtonGroup.Root>

<div id="buttonGroupWorkoutForm" class="flex flex-row gap-x-2"></div>

{#if formDisplayStateValue.formState === FormState.AddSet || formDisplayStateValue.formState === FormState.EditSet}
	<section id="addSetForm">
		<header class="">
			<h2 class="text-2xl">
				{formDisplayStateValue.formState === FormState.AddSet ? 'Add' : 'Update'} a set
			</h2>
		</header>
		<form
			method="POST"
			action={formDisplayStateValue.formState === FormState.AddSet ? '?/addASet' : '?/editASet'}
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
					disabled={formDisplayStateValue.formState === FormState.EditSet}
				>
					<!-- <option value={-1}>Choose an exercise</option> -->
					{#each userExercise as anExercise (anExercise.id)}
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
						value={formDisplayStateValue.formState === FormState.EditSet
							? formDisplayStateValue.setState?.repNumber
							: null}
						class="w-full rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
						required
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
						value={formDisplayStateValue.formState === FormState.EditSet
							? formDisplayStateValue.setState?.weight
							: null}
						class="w-full rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
						required
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
					value={formDisplayStateValue.formState === FormState.EditSet
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
					value={formDisplayStateValue.formState === FormState.EditSet
						? formDisplayStateValue.setState?.comment
						: null}
					class="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
				/>
			</div>
			<input name="userId" bind:value={user.id} hidden />
			<input name="trainingSessionId" bind:value={trainingSessionInfo.id} hidden />

			{#if formDisplayStateValue.formState === FormState.EditSet}
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
{:else if formDisplayStateValue.formState === FormState.EditWorkoutInfo}
	<section id="editWorkoutForm">
		<header>
			<h2 class="text-2xl">Edit current workout</h2>
		</header>
		<form method="POST" action="?/editWorkout" class="grid gap-2" use:enhance>
			<input name="userId" bind:value={user.id} hidden />
			<input name="trainingSessionId" bind:value={trainingSessionInfo.id} hidden />

			<div class="grid gap-1">
				<label for="place" class="text-sm">Place</label>
				<input
					name="place"
					type="text"
					placeholder="Basic Park Fit"
					autocomplete="on"
					bind:value={trainingSessionInfo.place}
					class="w-full rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
				/>
			</div>

			<div class="grid gap-1">
				<label for="duration" class="text-sm">Duration (in minutes)</label>
				<input
					name="duration"
					type="number"
					min="0"
					placeholder="60"
					bind:value={trainingSessionInfo.duration}
					class="w-full rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
				/>
			</div>

			<div class="grid gap-1">
				<label for="comment" class="text-sm">Comment</label>
				<input
					name="comment"
					type="text"
					placeholder="Trained to failure, good pump"
					bind:value={trainingSessionInfo.comment}
					class="w-full rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
				/>
			</div>

			<button
				class="w-fit justify-self-end rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
			>
				Send
			</button>
		</form>
	</section>
{:else if formDisplayStateValue.formState === FormState.Hide}
	<!-- Display nothing -->
{:else if formDisplayStateValue.formState === FormState.AddTag}
	<section id="AddTagForm">
		<header>
			<h2 class="text-2xl">Add tags to current workout</h2>
		</header>
		<!-- 			action={formDisplayStateValue.formState === FormState.AddSet ? '?/addASet' : '?/editASet'}
 -->
		<p>Tags available:</p>
		{#each userTag as aUserTag (aUserTag.id)}
			<form method="POST" class="grid w-fit gap-2" use:enhance action="?/toggleTag">
				<input name="userId" bind:value={user.id} hidden />
				<!-- <input name="userId" value="15" hidden /> -->
				<input name="tagId" bind:value={aUserTag.id} hidden />
				<!-- <input name="tagId" value="999999" hidden /> -->
				<input name="workoutId" bind:value={trainingSessionInfo.id} hidden />
				<!-- <input name="workoutId" value="12121212" hidden /> -->
				<input name="tagName" bind:value={aUserTag.name} hidden />
				<Button
					variant={tagIds.has(aUserTag.id) ? 'secondary' : 'ghost'}
					type="submit"
					class="py-.5 rounded-full px-2.5 text-sm"
				>
					{aUserTag.name}
				</Button>
			</form>
		{/each}
		<form class="flex w-full items-center space-x-4" method="post" action="?/createTag">
			<Label for="newTagName" class="basis-1/6">New tag:</Label>
			<Input
				id="newTagName"
				name="newTagName"
				class="basis-3/6"
				type="text"
				placeholder="Shoulder"
				required
			/>
			<input name="userId" bind:value={user.id} hidden />
			<Button type="submit">Create</Button>
		</form>
	</section>
{:else}
	<p>Something went wrong</p>
{/if}
