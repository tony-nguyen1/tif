<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Weight } from '$lib/server/db/schema';
	import { dateToStringCustomFormat } from '$lib/util.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import WeightDropdownMenu from '$lib/components/custom/weight/DropdownMenu/WeightDropdownMenu.svelte';

	interface Props {
		weightList: Weight[];
		editDialog: Snippet<[Weight]>;
		deleteForm: Snippet<[Weight]>;
	}

	let { weightList, editDialog, deleteForm }: Props = $props();
</script>

{#each weightList as aWeightEntry (aWeightEntry.id)}
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
