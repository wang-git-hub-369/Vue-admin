<template>
	<router-view></router-view>
</template>

<script>
	export default {
		name: 'app',
	}
</script>

<style>
	/* 公共样式 */
	body,
	html {
		padding: 0;
		margin: 0;
		height: 100%;
		width: 100%;
	}
	.action-box>a {
		color: #666;
		text-decoration: none;
	}
</style>
