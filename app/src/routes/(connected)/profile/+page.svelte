<script lang="ts">
	import type { PageServerData, ActionData } from './$types.js';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { page } from '$app/state';

	// console.info('profile');
	// console.info(page.data);
	// let oofData = page.data;

	const { data, form }: { data: PageServerData; form: ActionData } = $props();
	const { user, userInfo } = data;
</script>

<header class="grid grid-cols-2">
	<h1 class="text-5xl">Profile</h1>
	<aside class="justify-self-end text-right text-muted-foreground">
		<h2 class="text-xs">connected as {user.username}</h2>
		<h2 class="text-xs">{user.id}</h2>
		<form method="post" action="?/logout" use:enhance>
			<Button type="submit" variant="link" class="text-red-400">Log out</Button>
		</form>
	</aside>
</header>
<section>
	<h3 class="text-lg">Edit user info</h3>
	<form method="post" action="?/editUserInfo" use:enhance>
		<input type="text" value={user.id} hidden />
		<input type="number" name="goalWeight" placeholder="56kg" value={userInfo!.goalWeight} />
		<select name="goal" id="goalSelect">
			<option value="bulking">Bulking</option>
			<option></option>
		</select>

		<Button type="submit" variant="outline">Send</Button>
	</form>

	<p>{userInfo?.goal} {userInfo?.goalWeight}</p>
	{#if form?.missing || form?.incorrect}
		<p class="error">:(</p>
	{:else}
		:)
	{/if}
</section>
