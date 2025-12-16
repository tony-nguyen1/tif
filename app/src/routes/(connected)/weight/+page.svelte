<script lang="ts">
	import type { PageServerData, ActionData } from './$types.js';
	import { enhance } from '$app/forms';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { dateToStringCustomFormat, createDeferred } from '$lib/util.js';
	import WeightDropdownMenu from '$lib/components/custom/weight/DropdownMenu/WeightDropdownMenu.svelte';
	import type { Weight } from '$lib/server/db/schema';

	const { data, form }: { data: PageServerData; form: ActionData } = $props();
	let formProcessing = $state(false);
</script>

<Toaster position="top-center" richColors />
<h1 class="text-5xl">Weight</h1>
<form
	method="post"
	class="grid gap-2"
	action="?/addWeight"
	use:enhance={() => {
		console.info('Form submitted');
		formProcessing = true;
		const deferred = createDeferred();
		toast.promise(deferred.promise, {
			loading: 'Processing ...',
			success: (val) => {
				return val as string;
			},
			error: (reason) => reason as string
		});

		return async ({ result, update }) => {
			// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
			await update();

			// `result` is the object returned by the action of the server
			if (result.type === 'success') {
				// lastMealPlace = form?.lastMealPlace ?? '';
				deferred.resolve(
					`Weight entry registered !  ${form!.inserted!.weight} kg - ${form!.inserted!.date}`
				);
			} else if (result.type === 'failure') {
				deferred.reject(form!.message);
			} else if (result.type === 'error') {
				deferred.reject('Something went wrong');
			} else {
				deferred.resolve('Redirect');
			}

			console.info('Form processed');
			formProcessing = false;
		};
	}}
>
	<div class="grid gap-1">
		<label for="weightInput" class="text-sm">Weight mesured :</label>
		<InputGroup.Root>
			<!--   -->
			<!-- bind:value={goalWeightValue} -->
			<InputGroup.Input
				aria-invalid={form?.missing || form?.incorrect}
				id="weightInput"
				name="weight"
				placeholder="60"
				inputmode="numeric"
				pattern="[0-9][0-9][0-9]?"
			/>
			<InputGroup.Addon align="inline-end">
				<InputGroup.Text>Kilo</InputGroup.Text>
			</InputGroup.Addon>
		</InputGroup.Root>
	</div>

	<Button
		type="submit"
		variant="outline"
		class={['w-fit justify-self-end']}
		bind:disabled={formProcessing}
	>
		Send
	</Button>
</form>

<section id="weightsDisplay">
	<h2 class="mb-1.5 text-2xl">Weight log</h2>
	{#await data.weightArray}
		Waiting
	{:then weightArray}
		{#if weightArray.length === 0}
			<p>Empty</p>
		{:else}
			<div class="flex flex-col gap-y-3">
				{#each weightArray as aWeightEntry (aWeightEntry.id)}
					<article>
						<Card.Root>
							<Card.Header>
								<Card.Title class="text-xl font-semibold">
									{dateToStringCustomFormat(aWeightEntry.date)}
								</Card.Title>
								<Card.CardAction>
									<WeightDropdownMenu {aWeightEntry} {editDialog} {deleteForm} />
								</Card.CardAction>
							</Card.Header>
							<Card.CardContent>
								<p class="">
									{aWeightEntry.weight}
								</p>
							</Card.CardContent>
						</Card.Root>
					</article>
				{/each}
			</div>
		{/if}
	{:catch error}
		<p>error loading comments: {error.message}</p>
	{/await}
</section>

{#snippet deleteForm(aWeightEntry: Weight)}
	<form
		method="post"
		action="?/deleteWeight"
		data-weight-id={aWeightEntry.id}
		class="w-full"
		use:enhance={() => {
			console.info('Deletion form submitted');
			const deferred = createDeferred();
			toast.promise(deferred.promise, {
				loading: 'Processing deletion ...',
				success: (val) => {
					return val as string;
				},
				error: (reason) => reason as string
			});

			return async ({ result, update }) => {
				// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
				await update();

				// `result` is the object returned by the action of the server
				if (result.type === 'success') {
					deferred.resolve(`Deleted !`);
				} else if (result.type === 'failure') {
					deferred.reject(form!.message);
				} else if (result.type === 'error') {
					deferred.reject('Something went wrong');
				} else {
					deferred.resolve('Redirect');
				}

				console.info('Deletion form processed');
			};
		}}
	>
		<input name="weightId" value={aWeightEntry.id} hidden />
		<button type="submit" class="w-full text-left text-red-500">Delete</button>
	</form>
{/snippet}

{#snippet editDialog(aWeightEntry: Weight)}
	<Dialog.Root>
		<Dialog.Trigger class="w-full text-left">Edit</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title class="text-xl">
					Edit weight entry {aWeightEntry.id}
				</Dialog.Title>
				<Dialog.DialogDescription>
					{dateToStringCustomFormat(aWeightEntry.date)}
				</Dialog.DialogDescription>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
{/snippet}
