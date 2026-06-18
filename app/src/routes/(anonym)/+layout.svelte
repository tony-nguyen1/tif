<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import forgejoLogo from '$lib/assets/img/forgejo.svg';
	import githubLogoDark from '$lib/assets/img/github-dark.svg';
	import githubLogoLight from '$lib/assets/img/github.svg';
	import linkedInLogo from '$lib/assets/img/linkedIn.webp';
	import SolarHome2Outline from '@iconify-svelte/solar/home-2-outline';
	import { SquareArrowOutUpRight } from '@lucide/svelte/icons';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { ModeWatcher } from 'mode-watcher';
	import '../../app.css';
	import type { LayoutProps } from './$types';

	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toggleMode } from 'mode-watcher';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<div class="flex w-full flex-col">
	<main class="grid grow overflow-y-auto">
		{@render children?.()}
		<hr class="mx-6 mt-8 mb-3" />
		<footer class="grid grid-rows-[auto_auto_auto] justify-items-center pb-2">
			<div class="flex flex-row gap-x-6">
				<Button variant="link" href="/about" class="w-fit text-lg">About</Button>
				<Button variant="link" href="https://github.com/tony-nguyen1/tif" class="w-fit text-lg"
					>Source<SquareArrowOutUpRight /></Button
				>
			</div>
			<div class="mt-3.5 flex flex-row gap-x-10">
				<a href="https://github.com/tony-nguyen1">
					<img src={githubLogoLight} class="block h-7 dark:hidden" alt="Logo Github" />
					<img src={githubLogoDark} class="hidden h-7 dark:block" alt="Logo Github" />
				</a>
				<a href="https://forgejo.nguyentony.fr">
					<img
						src={forgejoLogo}
						alt="Logo Forgejo"
						class="h-7"
						title="Self-hosted Forgejo instance"
					/>
				</a>
				<a href="https://www.linkedin.com/in/nguyentoony/">
					<img src={linkedInLogo} alt="Logo LinkedIn" class="h-7" />
				</a>
			</div>
			<div class="mt-6 text-center text-zinc-600 dark:text-zinc-300">
				© 2026 Tony Nguyen. MIT License.
			</div>
		</footer>
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
