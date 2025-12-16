<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { EllipsisVertical } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { Weight } from '$lib/server/db/schema';

	interface Props {
		aWeightEntry: Weight;
		editDialog: Snippet<[Weight]>;
		deleteForm: Snippet<[Weight]>;
	}

	let { aWeightEntry, editDialog, deleteForm }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<EllipsisVertical />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
			{@render editDialog(aWeightEntry)}
		</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
			{@render deleteForm(aWeightEntry)}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
