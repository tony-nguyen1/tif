<script>
	import { enhance } from '$app/forms';
	// import { createDeferred } from '$lib/util';
	// import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { createDeferred } from '$lib/util.js';
	import { toast } from 'svelte-sonner';

	const { data, form } = $props();
</script>

<h1 class="text-5xl">Tag</h1>
<section>
	<h2 class="text-2xl">Add a new tag</h2>
	<!-- flex w-full items-center space-x-4 -->
	<form
		class="grid gap-2"
		method="post"
		action="?/createTag"
		use:enhance={() => {
			const deferred = createDeferred();
			toast.promise(deferred.promise, {
				loading: 'Processing ...',
				success: (val) => {
					return val;
				},
				error: (reason) => {
					if (typeof reason === 'string') return reason;
					else return 'Reason unkown';
				}
			});
			return async ({ result, update }) => {
				await update();
				if (result.type === 'success') {
					deferred.resolve(`Tag created !`);
				} else if (result.type === 'failure') {
					deferred.reject(form?.message ?? 'Failed to create the new tag');
				} else if (result.type === 'error') {
					deferred.reject('Something went wrong');
				} else {
					deferred.resolve('Redirect');
				}
			};
		}}
	>
		<div class="grid gap-1">
			<Label for="newTagName" class="text-sm">Name of the tag:</Label>
			<Input
				id="newTagName"
				name="newTagName"
				class=""
				type="text"
				placeholder="Shoulder"
				required
			/>
		</div>
		<Button type="submit" variant="outline" class="w-fit justify-self-end">Create</Button>
	</form>
</section>

<section>
	<h2>All tags</h2>
	<div class="flex flex-row flex-wrap gap-x-2 gap-y-2.5">
		{#each data.tagUserAll as aTag (aTag.id)}
			<article
				class="w-fit rounded-full border px-2 py-0.5 text-sm dark:border-white dark:bg-black"
			>
				{aTag.name}
			</article>
		{/each}
	</div>
</section>
