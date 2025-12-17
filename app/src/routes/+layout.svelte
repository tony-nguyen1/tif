<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<Toaster position="top-center" richColors />
{@render children?.()}
