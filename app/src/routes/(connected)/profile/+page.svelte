<script lang="ts">
	import type { PageServerData } from './$types.js';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';

	let { data }: { data: PageServerData } = $props();
</script>

<header class="grid grid-cols-2">
	<h1 class="text-5xl">Profile</h1>
	<aside class="justify-self-end text-right text-muted-foreground">
		<h2 class="text-xs">connected as {data.user.username}</h2>
		<h2 class="text-xs">{data.user.id}</h2>
		<form method="post" action="?/logout" use:enhance>
			<Button variant="link" class="text-red-400">Log out</Button>
		</form>
	</aside>
</header>
