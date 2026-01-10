<script lang="ts">
	import { page } from '$app/state';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<svelte:head>
	<title>Nyx - Error {page.status}</title>
</svelte:head>
<ModeWatcher />
<main class="grid grow place-items-center dark:bg-black dark:text-white">
	<section class="grid place-items-center gap-y-8">
		<header class="grid place-items-center">
			<h2 class="text-lg font-bold tracking-widest dark:text-red-500">{page.status}</h2>
			<h1 class="text-7xl">Error</h1>
			<h3 class="dark:text-zinc-200">{page.error?.message}</h3>
		</header>
		<Button
			href={resolve('/(anonym)')}
			variant="outline"
			class="dark:border-green-600 dark:bg-green-900">Go home</Button
		>
	</section>
</main>
