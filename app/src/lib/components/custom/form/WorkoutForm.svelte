<script lang="ts">
	import { enhance } from '$app/forms';
	import { FormState } from './myEnum';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { createDeferred } from '$lib/util';
	import { toast } from 'svelte-sonner';
	// import * as table from '$lib/server/db/schema';
	import type { FormStateUnion } from './WorkoutFormState.svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	// table.Exercise[]
	// interface Props {
	// 	userExercise: table.Exercise[];
	// 	trainingSessionInfo: table.Workout;
	// 	formDisplayStateValue: FormStateUnion;
	// 	tagUserAll: table.Tag[];
	// 	tagWorkoutId: Set<number>;
	// }

	let {
		userExercise,
		trainingSessionInfo,
		formDisplayStateValue = $bindable<FormStateUnion>(),
		tagUserAll,
		tagWorkoutId,
		form
	} = $props();

	const triggerContent = $derived(
		userExercise.find(
			(f: { id: number; name: string }) => f.id === formDisplayStateValue.selectedExerciseId
		)?.name ?? 'Select an exrcise'
	);
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
		}}
	>
		Add tag
	</Button>
</ButtonGroup.Root>

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
				<Select.Root
					name="exerciseId"
					type="single"
					bind:value={formDisplayStateValue.selectedExerciseId}
				>
					<Select.Trigger class="w-full">{triggerContent}</Select.Trigger>
					<Select.Content>
						<Select.Item value="">None</Select.Item>
						{#each userExercise as anExercise (anExercise.id)}
							<Select.Item value={anExercise.id}>{anExercise.name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="grid w-full gap-1">
					<label for="rep" class="w-full text-sm">Number of rep :</label>
					<InputGroup.Root>
						<!-- aria-invalid={form?.missing || form?.incorrect} -->
						<InputGroup.Input
							id="rep"
							type="number"
							name="rep"
							step=".5"
							min="0"
							placeholder="8"
							value={formDisplayStateValue.formState === FormState.EditSet
								? formDisplayStateValue.setState?.repNumber
								: null}
							required
							inputmode="numeric"
						/>
					</InputGroup.Root>
				</div>

				<div class="grid w-full gap-1">
					<label for="weight" class="w-fit text-sm"> Weight used : </label>
					<InputGroup.Root>
						<!-- aria-invalid={form?.missing || form?.incorrect} -->
						<InputGroup.Input
							name="weight"
							autocomplete="off"
							type="number"
							step=".125"
							min="0"
							placeholder="12.5"
							value={formDisplayStateValue.formState === FormState.EditSet
								? formDisplayStateValue.setState?.weight
								: null}
							required
							inputmode="decimal"
						/>
						<InputGroup.Addon align="inline-end">
							<InputGroup.Text>Kg</InputGroup.Text>
						</InputGroup.Addon>
					</InputGroup.Root>
				</div>
			</div>

			<div class="grid gap-1">
				<label for="rir" class="text-sm"> Repetition in reserve : </label>
				<InputGroup.Root>
					<!-- aria-invalid={form?.missing || form?.incorrect} -->
					<InputGroup.Input
						name="rir"
						autocomplete="off"
						type="number"
						inputmode="numeric"
						min="0"
						max="10"
						placeholder="2"
						value={formDisplayStateValue.formState === FormState.EditSet
							? formDisplayStateValue.setState?.repInReserve
							: null}
					></InputGroup.Input>
				</InputGroup.Root>
			</div>

			<div class="grid gap-1">
				<label for="comment" class="text-sm"> Remark : </label>
				<InputGroup.Root>
					<!-- aria-invalid={form?.missing || form?.incorrect} -->
					<InputGroup.Input
						name="comment"
						autocomplete="off"
						type="text"
						inputmode="text"
						placeholder="Good range of motion"
						value={formDisplayStateValue.formState === FormState.EditSet
							? formDisplayStateValue.setState?.comment
							: null}
					></InputGroup.Input>
				</InputGroup.Root>
			</div>
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
		<form
			method="POST"
			action="?/editWorkout"
			class="grid gap-2"
			use:enhance={() => {
				const deferred = createDeferred();
				toast.promise(deferred.promise, {
					loading: 'Processing ...',
					success: (val) => {
						return val as string;
					},
					error: (reason) => reason as string
				});

				return async ({ result, update }) => {
					await update();

					if (result.type === 'success') {
						deferred.resolve(`Workout information edited successfuly !`);
						formDisplayStateValue.formState = FormState.EditWorkoutInfo;
					} else if (result.type === 'failure') {
						deferred.reject(form!.message);
					} else if (result.type === 'error') {
						deferred.reject('Something went wrong');
					} else {
						deferred.resolve('Redirect');
					}
				};
			}}
		>
			<input name="trainingSessionId" value={trainingSessionInfo.id} hidden />

			<div class="grid gap-1">
				<label for="place" class="text-sm">Place</label>
				<InputGroup.Root>
					<!-- aria-invalid={form?.missing || form?.incorrect} -->
					<InputGroup.Input
						name="place"
						type="text"
						placeholder="Basic Park Fit"
						autocomplete="on"
						value={trainingSessionInfo.place}
						inputmode="text"
					/>
				</InputGroup.Root>
			</div>

			<div class="grid gap-1">
				<label for="duration" class="text-sm">Duration</label>
				<InputGroup.Root>
					<!-- aria-invalid={form?.missing || form?.incorrect} -->
					<InputGroup.Input
						placeholder="60"
						inputmode="numeric"
						name="duration"
						value={trainingSessionInfo.duration}
						pattern="[0-9][0-9]?[0-9]?"
					/>
					<InputGroup.Addon align="inline-end">
						<InputGroup.Text>minutes</InputGroup.Text>
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>

			<div class="grid gap-1">
				<label for="comment" class="text-sm">Comment</label>
				<InputGroup.Root>
					<InputGroup.Textarea
						name="comment"
						autocomplete="off"
						placeholder="Trained to failure, good pump"
						value={trainingSessionInfo.comment}
						rows={3}
						inputmode="text"
					/>
				</InputGroup.Root>
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
		<p class="mb-1">Tags available:</p>
		<div class="mb-1.5 flex w-full max-w-dvw flex-row flex-wrap gap-x-2">
			{#each tagUserAll as aUserTag (aUserTag.id)}
				<form
					method="POST"
					class="w-fit"
					use:enhance={() => {
						const deferred = createDeferred();
						toast.promise(deferred.promise, {
							loading: 'Processing ...',
							success: (val) => {
								return val as string;
							},
							error: (reason) => reason as string
						});

						return async ({ result, update }) => {
							await update();

							if (result.type === 'success') {
								deferred.resolve(
									`Tag ${form.tagName} ${form.removed ? 'removed' : 'added'} successfuly !`
								);
								formDisplayStateValue.formState = FormState.AddTag;
							} else if (result.type === 'failure') {
								deferred.reject(form!.message);
							} else if (result.type === 'error') {
								deferred.reject('Something went wrong');
							} else {
								deferred.resolve('Redirect');
							}
						};
					}}
					action="?/toggleTag"
				>
					<input name="tagId" value={aUserTag.id} hidden />
					<Button
						variant={tagWorkoutId.has(aUserTag.id) ? 'secondary' : 'ghost'}
						type="submit"
						class="py-.5 w-fit rounded-full border px-2.5 text-sm"
					>
						{aUserTag.name}
					</Button>
				</form>
			{/each}
		</div>
	</section>
{:else}
	<p>Something went wrong</p>
{/if}
