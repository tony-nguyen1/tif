<script lang="ts">
	import type { PageServerData, ActionData } from './$types.js';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { page } from '$app/state';
	import { goalEnum, type Goal } from '$lib/customType';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { toast } from 'svelte-sonner';
	import { Spinner } from '$lib/components/ui/spinner/index.js';

	const { data, form }: { data: PageServerData; form: ActionData } = $props();
	const { user, userInfo } = data;

	let goalWeightValue = $state(userInfo?.goalWeight ?? null);
	let selecteGoalValue = $state(userInfo?.goal ?? '');
	let formProcessing = $state(false);
	const triggerContent = $derived(goalEnum.find((f) => f === selecteGoalValue) ?? 'Select a goal');
</script>

<Toaster position="top-center" richColors />
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
	<!-- items-baseline -->
	<header class="grid grid-cols-2">
		<h3 class="w-fit text-2xl">Edit user info</h3>
		{#if formProcessing}
			<Spinner class="mr-5 size-5 self-center justify-self-end text-yellow-500" />
		{/if}
	</header>
	<form
		method="post"
		class="grid gap-2"
		action="?/editUserInfo"
		use:enhance={() => {
			console.info('Form submitted');
			formProcessing = true;

			return async ({ result, update }) => {
				// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
				await update();

				// `result` is the object returned by the action of the server
				if (result.type === 'success') {
					goalWeightValue = form?.updatedValues?.goalWeight ?? null;
					selecteGoalValue = form?.updatedValues?.goal ?? '';
					toast.success('User information updated');
				}
				console.info('Form processed');
				formProcessing = false;
			};
		}}
	>
		<div class="grid grid-cols-2 gap-4">
			<div class="grid gap-1">
				<label for="goalSelect" class="text-sm">Goal weight :</label>
				<InputGroup.Root>
					<InputGroup.Input
						aria-invalid={form?.missing || form?.incorrect}
						id="goalSelect"
						name="goalWeight"
						placeholder="60"
						inputmode="numeric"
						pattern="[0-9][0-9][0-9]?"
						bind:value={goalWeightValue}
					/>
					<InputGroup.Addon align="inline-end">
						<InputGroup.Text>Kilo</InputGroup.Text>
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>

			<div class="grid gap-1">
				<label for="goalSelect" class="text-sm">Goal :</label>
				<Select.Root name="goal" type="single" bind:value={selecteGoalValue}>
					<Select.Trigger class="w-full">
						{triggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">None</Select.Item>
						{#each goalEnum as aGoal, i (i)}
							{@const latestGoal: Goal|null = form?.success ? form?.updatedValues?.goal as Goal | null : userInfo!.goal as Goal | null}
							{@const selectedGoal = latestGoal ? goalEnum.findIndex((g) => g === latestGoal) : -1}
							<Select.Item value={aGoal}>{aGoal}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<div class="grid grid-cols-[auto_auto]">
			<div class="">
				{#if form?.missing || form?.incorrect}
					<p class="text-sm text-red-500">{form!.message}</p>
				{/if}
			</div>
			<Button
				type="submit"
				variant="outline"
				class={['w-fit justify-self-end']}
				bind:disabled={formProcessing}
			>
				Send
			</Button>
		</div>
	</form>
</section>
