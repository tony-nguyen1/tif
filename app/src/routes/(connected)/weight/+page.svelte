<script lang="ts">
	import type { PageServerData, ActionData } from './$types.js';
	import { enhance } from '$app/forms';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	const { data, form }: { data: PageServerData; form: ActionData } = $props();
	let formProcessing = $state(false);

	// FIXME : extract to util lib
	function createDeferred<T>() {
		let resolve!: (value: T | PromiseLike<T>) => void;
		let reject!: (reason?: unknown) => void;

		const promise = new Promise<T>((res, rej) => {
			resolve = res;
			reject = rej;
		});

		return { promise, resolve, reject };
	}
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
	<h2>Weight log</h2>
	{#await data.weightArray}
		Waiting
	{:then weightArray}
		{#if weightArray.length === 0}
			<p>Empty</p>
		{:else}
			{#each weightArray as aWeightEntry (aWeightEntry.id)}
				<p>
					{aWeightEntry.id} <br />
					{aWeightEntry.date} <br />
					{aWeightEntry.weight}
				</p>
			{/each}
		{/if}
	{:catch error}
		<p>error loading comments: {error.message}</p>
	{/await}
</section>
