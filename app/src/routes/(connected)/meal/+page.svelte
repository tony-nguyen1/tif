<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<h1 class="text-5xl">Meal</h1>
<section id="addMealForm">
	<header class="">
		<h2 class="text-2xl">Add a meal</h2>
	</header>
	<form method="POST" class="grid gap-2" use:enhance>
		<div class="grid gap-1">
			<label for="place" class="text-sm">Place</label>
			<input
				name="place"
				autocomplete="on"
				type="text"
				placeholder="Home"
				class="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
			/>
		</div>

		<div class="grid gap-1">
			<label for="place" class="text-sm">Protein estimation (g)</label>
			<input
				required
				name="place"
				autocomplete="off"
				type="number"
				min="-1"
				placeholder="35 gramme"
				class="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
			/>
		</div>

		<div class="grid gap-1">
			<label for="fullness" class="text-sm">Fullness (1/empty - 10/full)</label>
			<input
				required
				name="fullness"
				autocomplete="off"
				type="number"
				min="-1"
				placeholder="5"
				class="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
			/>
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

		<!-- <input name="userId" bind:value={data.user.id} hidden /> -->

		<button
			class="w-fit justify-self-end rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>
			Send
		</button>
	</form>
</section>
