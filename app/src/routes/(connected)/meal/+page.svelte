<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { EllipsisVertical } from '@lucide/svelte';
	// import { Button } from '$lib/components/ui/button/index.js';
	// import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Toggle } from '$lib/components/ui/toggle/index.js';

	function submitDelete(mealId: number) {
		const f: HTMLFormElement = document.querySelector(`form[data-meal-id="${mealId}"]`)!;
		f.requestSubmit();
	}

	let { data }: PageProps = $props();

	let formStateDisplay = $state(true);
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
			<input
				name="place"
				autocomplete="on"
				type="text"
				placeholder="Home"
				required
				class="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
			/>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="grid gap-1">
				<label for="protein" class="text-sm">Protein estimation (g)</label>
				<input
					required
					name="protein"
					autocomplete="off"
					type="number"
					min="-1"
					placeholder="35 grammes"
					class="w-full rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
				/>
			</div>
			<div class="grid gap-1">
				<label for="fullness" class="text-sm">Fullness</label>
				<input
					required
					name="fullness"
					autocomplete="off"
					type="number"
					min="-1"
					placeholder="5"
					class="w-full rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
				/>
			</div>
		</div>

		<div class="grid gap-1">
			<label for="description" class="text-sm">Description</label>
			<textarea
				required
				name="description"
				autocomplete="off"
				placeholder="Fish & chips"
				rows="3"
				class="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
			></textarea>
		</div>

		<input name="userId" bind:value={data.user.id} hidden />

		<!-- <input name="userId" bind:value={data.user.id} hidden /> -->

		<button
			class="w-fit justify-self-end rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>
			Send
		</button>
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
							{`${aMeal.date.toLocaleDateString()} ${aMeal.date.getHours()}:${aMeal.date.getMinutes()}`}
						</Card.Title>
						<span class="text-sm text-muted-foreground italic">
							At {aMeal.place} – {aMeal.fullness}/10 fullness – {aMeal.protein}g of protein
							<!-- — -->
						</span>

						<Card.CardAction>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<!-- | -->
									<EllipsisVertical />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.Item
										onclick={() => {
											console.info('clicked edit button');
										}}>Edit</DropdownMenu.Item
									>
									<!-- Can't use this, very unreliable -->
									<!-- <DropdownMenu.Item>
										<form method="post" action="?/deleteMeal" use:enhance>
											<input name="mealId" value={aMeal.id} hidden />
											<button type="submit">Delete</button>
										</form>
									</DropdownMenu.Item> -->

									<DropdownMenu.Item onclick={() => submitDelete(aMeal.id)} class="text-red-500">
										Delete
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
							<form method="post" action="?/deleteMeal" data-meal-id={aMeal.id} hidden use:enhance>
								<input name="mealId" value={aMeal.id} />
							</form>
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

<!-- <ButtonGroup.Root>
	<Button variant="outline">Display form</Button>
	<Button variant="outline">Hide form</Button>
	<Button variant="outline">Editing</Button>
</ButtonGroup.Root> -->
