<script lang="ts">
	import { SquareArrowOutUpRight } from '@lucide/svelte/icons';
</script>

<div class="grid gap-y-6">
	<section class="mt-12 px-4">
		<header>
			<h1 class="mb-1.5 text-5xl">About</h1>
		</header>
		<p>
			Nyx is a simple easy to use web application to track habits related to your life (meal, sleep,
			weight) and your workouts.
		</p>
	</section>
	<section class="px-4">
		<header>
			<h1 class="mb-1.5 text-5xl">What i used to do</h1>
		</header>
		<p>I was tired of writing the exercises i did in the default iOS notes taking application.</p>
		<p>
			I could not search throught my notes properly. Writing everything by hands felt like wasting
			my time. It was poorly organized and tracking multiple things would be tiresome. After some
			time, i accumulated some data but could not analyse it properly. It ended as a ever growing
			note.
		</p>
	</section>
	<section class="px-4">
		<header>
			<h1 class="mb-1.5 text-5xl">My solution</h1>
		</header>
		<p>
			To resolve the issue, i'm making this website. It will be packed with only features that i
			need, simple and mostly based on text and form
		</p>
	</section>
	<section class="px-4">
		<header>
			<h1 class="mb-1.5 text-5xl">Values</h1>
		</header>
		<ul>
			<li>Good UX</li>
			<li>Performant</li>
			<li>Open source</li>
			<li>Mobile first design</li>
		</ul>
	</section>
	<section class="px-4">
		<header>
			<h1 class="mb-1.5 text-5xl">About me</h1>
		</header>
		<p>
			My name is Tony Nguyen. If you want to check me out, here is my <a
				class="inline-flex items-center gap-x-0.5"
				href="https://github.com/tony-nguyen1">Github<SquareArrowOutUpRight size={18} /></a
			>
			and
			<a class="inline-flex items-center gap-x-0.5" href="https://www.linkedin.com/in/nguyentoony"
				>LinkedIn<SquareArrowOutUpRight size={18} /></a
			>.
		</p>
	</section>
</div>
