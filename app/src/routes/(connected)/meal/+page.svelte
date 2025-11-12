<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	// import * as DropdownMenu '$lib/components/ui/button-group'
	import { Button } from '$lib/components/ui/button/index.js';
	// import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	let { data }: PageProps = $props();
</script>

<h1 class="text-5xl">Meal</h1>
<section id="addMealForm">
	<header class="">
		<h2 class="text-2xl">Add a meal</h2>
	</header>
	<form method="POST" action="?/meal" class="grid gap-2" use:enhance>
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

<section id="mealList">
	{#each data.mealArray as aMeal (aMeal.id)}
		<article>
			<Card.Root>
				<Card.Header>
					<Card.Title>
						{aMeal.id}
					</Card.Title>
				</Card.Header>
				<Card.Action
					><DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Button>...</Button>
							<!-- {#snippet child({ props })}
							<Button {...props} variant="outline" class="!pl-2">
								<ChevronDown />
							</Button>
						{/snippet} -->
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" class="[--radius:1rem]">
							<DropdownMenu.Group>
								<DropdownMenu.Item>
									<!-- <VolumeOff /> -->
									Mute Conversation
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<!-- <Check /> -->
									Mark as Read
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<!-- <AlertTriangle /> -->
									Report Conversation
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<!-- <UserRoundX /> -->
									Block User
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<!-- <Share /> -->
									Share Conversation
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<!-- <Copy /> -->
									Copy Conversation
								</DropdownMenu.Item>
							</DropdownMenu.Group>
							<DropdownMenu.Separator />
							<DropdownMenu.Group>
								<DropdownMenu.Item variant="destructive">
									<!-- <Trash /> -->
									Delete Conversation
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root></Card.Action
				>
				<Card.CardContent>
					{`${aMeal.date.toLocaleDateString()} ${aMeal.date.getHours()}:${aMeal.date.getMinutes()}`}
					<br />
					<span class="text-sm text-muted-foreground">
						At {aMeal.place} – {aMeal.fullness}/10 fullness – {aMeal.protein}g of protein
						<!-- — -->
					</span>
					<br />
					<span class="text-sm text-muted-foreground"> </span>
					<br />
					<p class="">
						{aMeal.description}
					</p>
				</Card.CardContent>
			</Card.Root>
		</article>
	{/each}
</section>

<!-- <ButtonGroup.Root>
	<Button variant="outline">Follow</Button>

</ButtonGroup.Root> -->
