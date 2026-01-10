<script lang="ts">
	import '../../../app.css';
	import { enhance } from '$app/forms';
	import { ModeWatcher } from 'mode-watcher';
	import type { ActionData } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { form }: { form: ActionData } = $props();
</script>

<ModeWatcher />
<Card.Root class="mx-8 h-fit self-center">
	<Card.Content>
		<form method="post" action="?/login" class="grid gap-2" use:enhance>
			<div class="grid gap-1">
				<label for="username" class="text-2xl">Username</label>
				<input
					id="username"
					name="username"
					autocomplete="off"
					class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
				/>
			</div>
			<div class="grid gap-1">
				<label for="password" class="text-2xl">Password</label>
				<input
					id="password"
					type="password"
					name="password"
					autocomplete="off"
					class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
				/>
			</div>
			<Button variant="outline" type="submit" class="mt-2 w-fit justify-self-end">Login</Button>
			<br />
			<Button variant="outline" type="submit" formaction="?/register">Create an account</Button>
		</form>

		<p class="text-red-500">{form?.message ?? ''}</p>
	</Card.Content>
</Card.Root>
