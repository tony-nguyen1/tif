<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import mealPage from '$lib/assets/img/meal_page.webp';
	import sleepPage from '$lib/assets/img/sleep_page.webp';
	import weightPage from '$lib/assets/img/weight_page.webp';
	import forgejoLogo from '$lib/assets/img/forgejo.svg';
	import githubLogoLight from '$lib/assets/img/github.svg';
	import githubLogoDark from '$lib/assets/img/github-dark.svg';
	import linkedInLogo from '$lib/assets/img/linkedIn.webp';
	import loginPage from '$lib/assets/img/login_page.webp';
	import {
		Zap,
		MousePointer2,
		Milestone,
		BadgeEuro,
		Sparkles,
		SquareArrowOutUpRight
	} from '@lucide/svelte/icons';
</script>

<section class="mt-12 mb-8 grid gap-y-6 px-4">
	<header>
		<h1 class="mb-1.5 text-5xl">Nyx</h1>
		<h2 class="text-lg">Track workouts, nutrition, sleep, and weight all in one app.</h2>
	</header>
	<Button variant="outline" href="/login" class="w-fit text-lg">Try now<MousePointer2 /></Button>
	<dl class="flex flex-col">
		<div class="relative pl-8">
			<dt class="inline font-bold">
				<Milestone class="absolute top-1 left-0 h-6 w-4.5" color="green" />
				Centralized.
			</dt>
			<dd class="inline text-zinc-600 dark:text-zinc-300">
				Log your Nutrition, Sleep, Workout, and Weight all under the same web application.
			</dd>
		</div>
		<div class="relative pl-8">
			<dt class="inline font-bold">
				<BadgeEuro class="absolute top-1 left-0 h-6 w-4.5" color="green" />
				Free.
			</dt>
			<dd class="inline text-zinc-600 dark:text-zinc-300">
				No subscriptions, no payments of any kind.
			</dd>
		</div>
		<div class="relative pl-8">
			<dt class="inline font-bold">
				<Sparkles class="absolute top-1 left-0 h-6 w-4.5" color="green" />
				Good UI/UX.
			</dt>
			<dd class="inline text-zinc-600 dark:text-zinc-300">
				Snappy, straightforward, and easy-to-use interface.
			</dd>
		</div>
		<div class="relative pl-8">
			<dt class="inline font-bold">
				<Zap class="absolute top-1 left-0 h-6 w-4.5" color="green" />
				Lightweight.
			</dt>
			<dd class="inline text-zinc-600 dark:text-zinc-300">Fast load time.</dd>
		</div>
	</dl>
</section>
<section>
	<h2 class="mx-4 mb-4 text-2xl">Sneak peek</h2>
	<article class="flex h-[500px] snap-x snap-mandatory flex-row gap-x-3 overflow-x-scroll">
		<img
			height="500px"
			src={mealPage}
			alt="Screenshot of the meal page"
			class="snap-start"
			loading="lazy"
		/>
		<img
			height="500px"
			src={sleepPage}
			alt="Screenshot of the sleep page"
			class="snap-start"
			loading="lazy"
		/>
		<img
			height="500px"
			src={weightPage}
			alt="Screenshot of the weight page"
			class="snap-start"
			loading="lazy"
		/>
		<img
			height="500px"
			src={loginPage}
			alt="Screenshot of the weight page"
			class="snap-start"
			loading="lazy"
		/>
	</article>
</section>
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
			<img src={forgejoLogo} alt="Logo Forgejo" class="h-7" />
		</a>
		<a href="https://www.linkedin.com/in/nguyentoony/">
			<img src={linkedInLogo} alt="Logo LinkedIn" class="h-7" />
		</a>
	</div>
	<div class="mt-6 text-center text-zinc-600 dark:text-zinc-300">
		© 2026 Tony Nguyen. MIT License.
	</div>
</footer>
