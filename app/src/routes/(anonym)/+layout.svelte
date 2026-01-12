<script lang="ts">
	import '../../app.css';
	import type { LayoutProps } from './$types';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SolarHome2Outline from '@iconify-svelte/solar/home-2-outline';

	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import { resolve } from '$app/paths';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<!-- test -->
<div class="flex w-full flex-col">
	<main class="grid grow overflow-y-auto">
		{@render children?.()}
	</main>
	<nav class="flex h-fit flex-row place-content-evenly border-t p-3">
		<Button variant="link" href={resolve('/')} aria-label="Home"
			><SolarHome2Outline class="size-9" /></Button
		>
		<!-- <a href={resolve('/(anonym)/login')}>Login</a> -->
		<Button variant="link" href={resolve('/(anonym)/login')}>Login</Button>

		<Button onclick={toggleMode} variant="outline" size="icon">
			<SunIcon
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
			/>
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</nav>
</div>
