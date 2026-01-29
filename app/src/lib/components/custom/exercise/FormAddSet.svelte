<script lang="ts">
	import { enhance } from '$app/forms';
	// import * as Select from '$lib/components/ui/select/index.js';
	import type { Workout } from '$lib/server/db/schema';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	export let workout: Workout;
	export let hidden: boolean;
</script>

<section {hidden}>
	<h2 class="text-2xl">
		Add a set to <a href={`/workout/${workout.id.toString()}`}>workout ({workout.id})</a>
	</h2>
	<form method="POST" action="?/addSet" class="grid gap-2" use:enhance>
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
						value=""
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
						value=""
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
					value=""
				></InputGroup.Input>
			</InputGroup.Root>
		</div>

		<div class="grid gap-1">
			<label for="comment" class="text-sm"> Remark : </label>
			<InputGroup.Root>
				<InputGroup.Input
					name="comment"
					autocomplete="off"
					type="text"
					inputmode="text"
					placeholder="Good range of motion"
					value=""
				></InputGroup.Input>
			</InputGroup.Root>
		</div>
		<Button type="submit" variant="outline" class="w-fit justify-self-end">Send</Button>
	</form>
</section>
