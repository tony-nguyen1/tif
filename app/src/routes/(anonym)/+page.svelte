<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import mealPage from '$lib/assets/img/meal_page.webp';
	import sleepPage from '$lib/assets/img/sleep_page.webp';
	import weightPage from '$lib/assets/img/weight_page.webp';
</script>

<h1 class="mb-2.5 text-5xl">Nyx</h1>
<section class="mb-3 grid justify-items-center gap-y-3">
	<h2 class="text-center text-xl">Track workouts, nutrition, sleep, and weight all in one app.</h2>
	<Button variant="outline" href="/login">Try now</Button>
	<p>
		A lightweight, mostly text-based tracker designed to give you full control over how you log your
		daily progress.
	</p>
</section>
<section class="mb-2.5">
	<h2 class="text-3xl">The problem</h2>
	<div class="flex flex-col gap-y-2">
		<p>
			Most of these features already exist, but they’re fragmented. <br />
			They’re spread across multiple apps and services, sometimes offline, sometimes online, and sometimes
			locked behind paywalls.
		</p>
		<p>
			The goal of this app is to <span class="font-bold">centralize</span> all those geatures in one
			place without juggling multiple apps, and for <span class="font-bold">free</span>.
		</p>
		<p>
			You’ll get a <span class="font-bold">snappy, straightforward, and easy-to-use interface</span
			>. Once past the authentication gate, you’ll find four main sections : Nutrition, Sleep,
			Workout, and Weight. Plus a Profile page that serves as your dashboard.
		</p>
	</div>
</section>
<section>
	<h2 class="mb-2.5 text-3xl">Sneak peek</h2>
	<article class="flex h-[500px] flex-row gap-x-3 overflow-x-scroll">
		<img height="500px" src={mealPage} alt="Screenshot of the meal page" class="" loading="lazy" />
		<img
			height="500px"
			src={sleepPage}
			alt="Screenshot of the sleep page"
			class=""
			loading="lazy"
		/>
		<img
			height="500px"
			src={weightPage}
			alt="Screenshot of the weight page"
			class=""
			loading="lazy"
		/>
	</article>
</section>
