<script lang="ts">
	import '../../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SolarDumbbellLargeMinimalisticOutline from '@iconify-svelte/solar/dumbbell-large-minimalistic-outline';
	import SolarHome2Outline from '@iconify-svelte/solar/home-2-outline';

	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<!-- test -->
<div class="flex w-full flex-col">
	<main class="grid grow auto-rows-min gap-y-4 overflow-y-auto px-3 py-3">
		{@render children?.()}
	</main>
	<nav class="flex h-fit flex-row">
		<a href={resolve('/')}><SolarHome2Outline class="size-9" /></a>
		<!-- <a href={resolve('/login')}>Login</a> -->
		<a href={resolve('/profile')}><SolarDumbbellLargeMinimalisticOutline class="size-9" /></a>
		<Button onclick={toggleMode} variant="outline" size="icon">
			<SunIcon
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
			/>
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</nav>
</div>
