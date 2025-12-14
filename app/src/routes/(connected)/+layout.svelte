<script lang="ts">
	import '../../app.css';
	import type { LayoutProps } from './$types';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SolarDumbbellLargeMinimalisticOutline from '@iconify-svelte/solar/dumbbell-large-minimalistic-outline';
	import SolarDonutBittenOutline from '@iconify-svelte/solar/donut-bitten-outline';
	import SolarMoonSleepOutline from '@iconify-svelte/solar/moon-sleep-outline';
	import SolarUserIdOutline from '@iconify-svelte/solar/user-id-outline';
	import SolarWeigherOutline from '@iconify-svelte/solar/weigher-outline';

	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import { resolve } from '$app/paths';

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<!-- test -->
<div class="flex w-full flex-col">
	<main class="grid grow auto-rows-min gap-y-2 overflow-y-auto px-3 py-3">
		{@render children?.()}
	</main>
	{#if data.userInfo!.goal || data.userInfo!.goalWeight}
		<div class="border-t text-center text-sm">
			Objective : {data.userInfo!.goal ?? 'N/A'} - Goal weight : {data.userInfo!.goalWeight
				? `${data.userInfo!.goalWeight}kg`
				: 'N/A'}
		</div>
	{/if}
	<nav class="flex h-fit flex-row place-content-evenly border-t p-3">
		<!-- <a href={resolve('/')}><SolarHome2Outline class="size-9" /></a> -->
		<a href={resolve('/(connected)/meal')}><SolarDonutBittenOutline class="size-9" /></a>
		<a href={resolve('/(connected)/sleep')}><SolarMoonSleepOutline class="size-9" /></a>
		<a href={resolve('/(connected)/workout')}>
			<SolarDumbbellLargeMinimalisticOutline class="size-9" />
		</a>
		<a href={resolve('/(connected)/weight')}><SolarWeigherOutline class="size-9" /></a>
		<a href={resolve('/(connected)/profile')}><SolarUserIdOutline class="size-9" /></a>
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
