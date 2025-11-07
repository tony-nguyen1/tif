<script lang="ts">
	import { enhance } from '$app/forms';
	// import type { ActionData } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	// let { form }: { form: ActionData } = $props();
</script>

<!-- <h1 class="mt-6 ml-8 text-5xl">Login</h1> -->

<!--
<p style="color: red">{form?.message ?? ''}</p> -->
<main class="grid w-full">
	<Card.Root class="mx-8 h-fit self-center">
		<!-- <Card.Header>
			<Card.Title>Card Title</Card.Title>
			<Card.Description>Card Description</Card.Description>
		</Card.Header> -->
		<Card.Content>
			<form method="post" action="?/login" class="grid gap-2" use:enhance>
				<div class="grid gap-1">
					<label for="username" class="text-2xl">Username</label>
					<input
						id="username"
						name="username"
						class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
					/>
				</div>
				<div class="grid gap-1">
					<label for="password" class="text-2xl">Password</label>
					<input
						id="password"
						type="password"
						name="password"
						class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
					/>
				</div>
				<!-- <button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
					>Login</button
				> -->
				<Button variant="outline" type="submit" class="mt-2 w-fit justify-self-end">Login</Button>
				<br />
				<Button variant="outline" type="submit" formaction="?/register">Create an account</Button>
				<!-- <button
					formaction="?/register"
					class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
					>Register</button
				> -->
			</form>
		</Card.Content>
		<!-- <Card.Footer>
			<p>Card Footer</p>
		</Card.Footer> -->
	</Card.Root>
</main>
