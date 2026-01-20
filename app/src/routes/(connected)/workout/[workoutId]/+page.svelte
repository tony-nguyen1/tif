<script lang="ts">
	// TODO : true error handling and redirection to error page
	// import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import { resolve } from '$app/paths';
	import WorkoutForm from '$lib/components/custom/form/WorkoutForm.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { FormStateUnion } from '$lib/components/custom/form/WorkoutFormState.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { EllipsisVertical } from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { enhance } from '$app/forms';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';

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
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<EllipsisVertical />
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
									<Dialog.Root>
										<Dialog.Trigger class="w-full text-left">Edit</Dialog.Trigger>
										<Dialog.Content>
											<Dialog.Header>
												<Dialog.Title class="text-xl">Edit set {aSet.id}</Dialog.Title>
											</Dialog.Header>
											<form method="post" action="?/editASet" class="grid gap-2">
												<div class="grid grid-cols-2 gap-4">
													<div class="grid w-full gap-1">
														<label for="rep" class="w-full text-sm">Number of rep :</label>
														<InputGroup.Root>
															<InputGroup.Input
																id="rep"
																type="number"
																name="rep"
																step=".5"
																min="0"
																placeholder="8"
																value={aSet.repNumber}
																required
																inputmode="numeric"
															/>
														</InputGroup.Root>
													</div>

													<div class="grid w-full gap-1">
														<label for="weight" class="w-fit text-sm"> Weight used : </label>
														<InputGroup.Root>
															<InputGroup.Input
																name="weight"
																autocomplete="off"
																type="number"
																step=".125"
																min="0"
																placeholder="12.5"
																value={aSet.weight}
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
														<InputGroup.Input
															name="rir"
															autocomplete="off"
															type="number"
															inputmode="numeric"
															min="0"
															max="10"
															placeholder="2"
															value={aSet.repInReserve}
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
															value={aSet.comment}
														></InputGroup.Input>
													</InputGroup.Root>
												</div>

												<input name="setId" value={aSet.id} hidden />

												<Button variant="outline" type="submit" class="justify-self-end">
													Send
												</Button>
											</form>
										</Dialog.Content>
									</Dialog.Root>
								</DropdownMenu.Item>
								<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
									<form method="post" action="?/deleteSet" use:enhance class="w-full">
										<input name="gymSetId" value={aSet.id} hidden />
										<button type="submit" class="w-full text-left text-red-500">Delete</button>
									</form>
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
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
