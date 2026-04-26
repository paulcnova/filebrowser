
<template>
	<div class="page-container">
		<div class="layout-backdrop movies-backdrop"></div>
		<nav class="header">
			<div class="icon"></div>
			<div class="search-bar">
				<input type="text" placeholder="Search..." class="search-bar-text"/>
				<button class="search-bar-button" type="submit">
					<i class="material-icons">search</i>
				</button>
			</div>
			<!-- TODO: Use an icon here or something. -->
			<RouterLink to="/settings" class="account">
				<div class="head"></div>
				<div class="body"></div>
			</RouterLink>
		</nav>
		<div :class="`movie-container ${viewType}`">
			<component v-if="viewType == ViewType.Listing" :is="currentView"/>
			<component v-else-if="viewType == ViewType.Details" :is="currentView" :details="currentDetails"/>
			<component v-else-if="viewType == ViewType.Player" :is="currentView" :details="currentDetails"/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue';
	import { RouterLink, useRoute } from 'vue-router';
	import { files as api } from "@/api";
	import type { MovieDetails, MovieListing } from '@/interface/Listing';
	import { useTitle } from '@vueuse/core';
	
	enum ViewType {
		Listing = "listing",
		Details = "details",
		Player = "player",
	}
	
	const ListingView = defineAsyncComponent(() => import("@/views/movies/MovieListing.vue"));
	const DetailsView = defineAsyncComponent(() => import("@/views/movies/MovieDetails.vue"));
	const PlayerView = defineAsyncComponent(() => import("@/views/movies/MoviePlayer.vue"));
	
	const title = useTitle();
	const route = useRoute();
	const movies = ref<MovieDetails[]>([]);
	const currentView = computed(() => {
		switch(viewType.value) {
			default: case ViewType.Listing: return ListingView;
			case ViewType.Details: return DetailsView;
			case ViewType.Player: return PlayerView;
		}
	});
	const currentDetails = computed(() => {
		if(movieIndex.value == -1) {
			movieIndex.value = getMovieIndex();
		}
		if(movieIndex.value == -1) { return null; }
		return movies.value[movieIndex.value];
	});
	const viewType = ref<ViewType>(getViewType());
	const movieIndex = ref<number>(getMovieIndex());
	
	title.value = "Movies - Casanova";
	
	function getMovieIndex(id?: string): number {
		return movies.value.findIndex(m => m.id == (id ?? `${route.params.id}`));
	}
	
	function getViewType(): ViewType {
		if(route.fullPath == "/movies" || route.fullPath == "/movies/") { return ViewType.Listing; }
		if(route.fullPath.endsWith("/view")) { return ViewType.Player; }
		return ViewType.Details;
	}
	
	function updateView(id?: string, player?: string) {
		movieIndex.value = getMovieIndex(id);
		viewType.value = id != undefined
			? player === undefined
				? ViewType.Details
				: ViewType.Player
			: ViewType.Listing;
		switch(viewType.value) {
			default: case ViewType.Listing: title.value = "Movies - Casanova"; break;
			case ViewType.Details: title.value = `${movies.value[movieIndex.value].name} - Casanova`; break;
			case ViewType.Player: title.value = `Watching ${movies.value[movieIndex.value].name} - Casanova`; break;
		}
	}
	
	watch(route, () => {
		movieIndex.value = getMovieIndex();
		const id = route.params.id ? route.params.id.toString() : undefined;
		const player = route.fullPath.endsWith("/view") ? "view" : undefined;
		updateView(id, player);
	});
	
	onMounted(async () => {
		const listingRes = await api.fetch("/movies/movies.listing.json", undefined, false);
		console.log(listingRes);
		const listing = JSON.parse(listingRes.content ?? "") as MovieListing;
		
		for(const id in listing) {
			movies.value.push(listing[id]);
		}
		movies.value.sort((left, right) => {
			return left.name.localeCompare(right.name);
		});
	})
</script>

<!-- Entire Page -->
<style scoped>
	.page-container {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: start;
		align-content: stretch;
		justify-content: space-between;
		width: 100%;
	}
	
	.movie-container { width: 100%; }
</style>

<!-- Header -->
<style scoped>
	nav.header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 4em;
		background-color: #166235;
		box-shadow: 0 10px 15px 4px #0009;
		z-index: 10;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		align-content: stretch;
		justify-content: space-between;
		padding-inline: 8px;
	}
</style>

<!-- Fake Account Icon -->
<style scoped>
	nav.header .icon {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: white;
		flex-shrink: 0;
	}
	
	nav.header .account {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: white;
		flex-shrink: 0;
		overflow: hidden;
	}
	
	nav.header .account .head {
		width: 16px;
		height: 16px;
		position: relative;
		left: 8px;
		top: 4px;
		background-color: #25f;
		border-radius: 50%;
	}
	
	nav.header .account .body {
		width: 16px;
		height: 32px;
		position: relative;
		left: 8px;
		top: 0px;
		border-radius: 50%;
		background-color: #25f;
	}
</style>

<!-- Search Bar -->
<style scoped>
	nav.header .search-bar {
		width: 50vw;
		margin: 1em;
	}
	
	nav.header .search-bar input {
		background-color: #101820;
		color: white;
		width: 100%;
		padding: 8px 16px;
		border: none;
		border-radius: 16px;
	}
	
	nav.header .search-bar .search-bar-button {
		position: absolute;
		margin-left: -31px;
		margin-top: 3px;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: none;
		background-color: dodgerblue;
		color: white;
		padding: 0;
		cursor: pointer;
	}
	
	nav.header .search-bar .search-bar-button i {
		text-align: center;
		width: 100%;
		height: 100%;
		line-height: 1.2;
	}
</style>
