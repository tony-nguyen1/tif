<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Toggle } from '$lib/components/ui/toggle/index.js';
	import { EllipsisVertical } from '@lucide/svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let formStateDisplay = $state(true);

	function dateToStringCustomFormat(aDate: Date) {
		return `${aDate.toLocaleDateString()} ${aDate.getHours()}:${aDate.getMinutes()}`;
	}
</script>

<h1 class="text-5xl">Meal</h1>
<div></div>
<section id="addMealForm">
	<header class="grid grid-cols-2">
		<h2 class="w-fit text-2xl">Add a meal</h2>
		<Toggle
			class="w-fit justify-self-end"
			pressed={false}
			variant="outline"
			onPressedChange={(b) => (formStateDisplay = !b)}
		>
			Hide form
		</Toggle>
	</header>
	<form method="POST" action="?/meal" class="grid gap-2" hidden={!formStateDisplay} use:enhance>
		<div class="grid gap-1">
			<label for="place" class="text-sm">Place</label>
			<InputGroup.Root>
				<InputGroup.Input name="place" autocomplete="on" type="text" placeholder="Home" required />
			</InputGroup.Root>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="grid gap-1">
				<label for="protein" class="text-sm">Protein estimation (g)</label>
				<InputGroup.Root>
					<InputGroup.Input
						required
						name="protein"
						autocomplete="off"
						min="0"
						max="100"
						placeholder="35"
						inputmode="numeric"
					/>
					<InputGroup.Addon align="inline-end">
						<InputGroup.Text>Grammes</InputGroup.Text>
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>
			<div class="grid gap-1">
				<label for="fullness" class="text-sm">Fullness</label>
				<InputGroup.Root>
					<InputGroup.Input
						required
						name="fullness"
						autocomplete="off"
						min="0"
						placeholder="5"
						inputmode="numeric"
						pattern="[0-9]"
					/>
					<InputGroup.Addon align="inline-end">
						<InputGroup.Text>/ 10</InputGroup.Text>
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>
		</div>

		<div class="grid gap-1">
			<label for="description" class="text-sm">Description</label>
			<InputGroup.Root>
				<InputGroup.Textarea
					required
					name="description"
					autocomplete="off"
					placeholder="Fish & chips"
					rows={3}
				/>
			</InputGroup.Root>
		</div>

		<input name="userId" bind:value={data.user.id} hidden />

		<Button variant="outline" type="submit" class="w-fit justify-self-end">Send</Button>
	</form>
</section>

<section id="mealList" class="">
	<h2 class="text-2xl">Past meals</h2>
	<div class="mt-1.5 flex flex-col gap-y-3">
		{#each data.mealArray as aMeal (aMeal.id)}
			<article>
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-xl font-semibold">
							{dateToStringCustomFormat(aMeal.date)}
						</Card.Title>
						<span class="text-sm text-muted-foreground italic">
							At {aMeal.place} – {aMeal.fullness}/10 fullness – {aMeal.protein}g of protein
						</span>

						<Card.CardAction>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<!-- | -->
									<EllipsisVertical />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
										<Dialog.Root>
											<Dialog.Trigger class="w-full text-left">Edit</Dialog.Trigger>
											<Dialog.Content>
												<Dialog.Header>
													<Dialog.Title class="text-xl">Edit meal {aMeal.id}</Dialog.Title>
													<Dialog.DialogDescription>
														{dateToStringCustomFormat(aMeal.date)}
													</Dialog.DialogDescription>
												</Dialog.Header>
												<form
													method="post"
													action="?/putMeal"
													onsubmit={() => {
														// wait(1000).then(() => (open = false));
													}}
													class="grid gap-2"
												>
													<input name="mealId" value={aMeal.id} hidden />
													<div class="grid gap-1">
														<label for="place" class="text-sm">Place</label>
														<InputGroup.Root>
															<InputGroup.Input
																name="place"
																autocomplete="on"
																type="text"
																placeholder="Home"
																value={aMeal.place}
																required
															/>
														</InputGroup.Root>
													</div>

													<div class="grid grid-cols-2 gap-4">
														<div class="grid gap-1">
															<label for="protein" class="text-sm">Protein estimation (g)</label>
															<InputGroup.Root>
																<InputGroup.Input
																	required
																	name="protein"
																	autocomplete="off"
																	inputmode="numeric"
																	min="0"
																	placeholder="35 grammes"
																	value={aMeal.protein}
																/>
															</InputGroup.Root>
														</div>
														<div class="grid gap-1">
															<label for="fullness" class="text-sm">Fullness</label>
															<InputGroup.Root>
																<InputGroup.Input
																	required
																	name="fullness"
																	autocomplete="off"
																	inputmode="numeric"
																	min="0"
																	placeholder="5"
																	value={aMeal.fullness}
																/>
																<InputGroup.Addon align="inline-end">
																	<InputGroup.Text>/ 10</InputGroup.Text>
																</InputGroup.Addon>
															</InputGroup.Root>
														</div>
													</div>

													<div class="grid gap-1">
														<label for="description" class="text-sm">Description</label>
														<InputGroup.Root>
															<InputGroup.Textarea
																required
																name="description"
																autocomplete="off"
																placeholder="Fish & chips"
																value={aMeal.description}
																rows={3}
															/>
														</InputGroup.Root>
													</div>

													<input name="userId" bind:value={data.user.id} hidden />
													<input name="mealId" value={aMeal.id} hidden />
													<!-- <input name="date" value={aMeal.date} hidden /> -->

													<Button variant="outline" type="submit" class="justify-self-end">
														Send
													</Button>
												</form>
											</Dialog.Content>
										</Dialog.Root>
									</DropdownMenu.Item>
									<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
										<form
											method="post"
											action="?/deleteMeal"
											data-meal-id={aMeal.id}
											use:enhance
											class="w-full"
										>
											<input name="mealId" value={aMeal.id} hidden />
											<button type="submit" class="w-full text-left text-red-500">Delete</button>
										</form>
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Card.CardAction>
					</Card.Header>
					<Card.CardContent>
						<p class="">
							{aMeal.description}
						</p>
					</Card.CardContent>
				</Card.Root>
			</article>
		{/each}
	</div>
</section>
