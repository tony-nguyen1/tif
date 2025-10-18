<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a href={'/'}>Home</a>
<a href={'/login'}>Login</a>
<a href={'/profile'}>Profile</a>

{@render children?.()}
