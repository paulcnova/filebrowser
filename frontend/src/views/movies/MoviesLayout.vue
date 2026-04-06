
<template>
	<main>
		<component v-if="viewType == ViewType.Listing" :is="currentView" @update="updateView"/>
		<component v-else-if="viewType == ViewType.Details" :is="currentView" :details="currentDetails" @update="updateView"/>
		<component v-else-if="viewType == ViewType.Player" :is="currentView" :details="currentDetails" @update="updateView"/>
	</main>
</template>

<script setup lang="ts">
	import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue';
	import { useRoute } from 'vue-router';
	import { files as api } from "@/api";
	import type { MovieDetails, MovieListing } from '@/interface/Listing';
	
	enum ViewType {
		Listing = "listing",
		Details = "details",
		Player = "player",
	}
	
	const ListingView = defineAsyncComponent(() => import("@/views/movies/MovieListing.vue"));
	const DetailsView = defineAsyncComponent(() => import("@/views/movies/MovieDetails.vue"));
	const PlayerView = defineAsyncComponent(() => import("@/views/movies/MoviePlayer.vue"));
	
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
	}
	
	watch(route, () => {
		movieIndex.value = getMovieIndex();
	});
	
	onMounted(async () => {
		const listingRes = await api.fetch("/movies/movies.listing.json");
		const listing = JSON.parse(listingRes.content ?? "") as MovieListing;
		
		for(const id in listing) {
			movies.value.push(listing[id]);
		}
		movies.value.sort((left, right) => {
			return left.name.localeCompare(right.name);
		});
	})
</script>
