
<template>
	<nav class="header">
		<div class="search-bar">
			<input type="text" placeholder="Search..." class="search-bar-text"/>
			<button class="search-bar-button" type="submit">
				<i class="material-icons">search</i>
			</button>
		</div>
	</nav>
	<div class="movie-container">
		<component v-if="viewType == ViewType.Listing" :is="currentView"/>
		<component v-else-if="viewType == ViewType.Details" :is="currentView" :details="currentDetails"/>
		<component v-else-if="viewType == ViewType.Player" :is="currentView" :details="currentDetails"/>
	</div>
</template>

<script setup lang="ts">
	import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue';
	import { useRoute } from 'vue-router';
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
	
	title.value = "Casanova - Movies";
	
	function getMovieIndex(id?: string): number {
		return movies.value.findIndex(m => m.id == (id ?? `${route.params.id}`));
	}
	
	function getViewType(): ViewType {
		if(route.fullPath == "/movies") { return ViewType.Listing; }
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
			default: case ViewType.Listing: title.value = "Casanova - Movies"; break;
			case ViewType.Details: title.value = `Casanova - ${movies.value[movieIndex.value].name}`; break;
			case ViewType.Player: title.value = `Casanova - Watching ${movies.value[movieIndex.value].name}`; break;
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
		const listing = JSON.parse(listingRes.content ?? "") as MovieListing;
		
		for(const id in listing) {
			movies.value.push(listing[id]);
		}
		movies.value.sort((left, right) => {
			return left.name.localeCompare(right.name);
		});
	})
</script>

<style scoped>
	nav.header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 4em;
		background-color: #adf;
		box-shadow: 0 10px 15px 4px black;
		z-index: 10;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
	
	nav.header .search-bar {
		width: 50vw;
		margin: 1em;
	}
	
	nav.header .search-bar .search-bar-text {
		width: 100%;
		padding: 8px 16px;
		border: none;
		border-radius: 16px;
	}
	
	nav.header .search-bar .search-bar-button {
		position: absolute;
		top: calc((4em - 24px) / 2);
		right: calc(25vw + 4px);
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: none;
		background-color: gold;
		cursor: pointer;
		margin-left: -3px;
	}
</style>
