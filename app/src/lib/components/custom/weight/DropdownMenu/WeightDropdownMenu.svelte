<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { EllipsisVertical } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		editDialog: Snippet;
		deleteForm: Snippet;
	}

	let { editDialog, deleteForm }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<EllipsisVertical />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
			{@render editDialog()}
		</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
			{@render deleteForm()}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
