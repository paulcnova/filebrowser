
<template>
	<div class="movies" v-for="movie in movies">
		<RouterLink :to="`/movies/${movie.id}`">
			<div class="poster">
				<img :src="movie.poster"/>
			</div>
		</RouterLink>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { files as api } from "@/api";
	import { type MovieDetails, type MovieListing } from '@/interface/Listing';
	import { RouterLink, useRoute } from 'vue-router';
	
	const movies = ref<MovieDetails[]>([]);
	const route = useRoute();
	
	onMounted(async () => {
		const listingRes = await api.fetch("/movies/movies.listing.json");
		const listing = JSON.parse(listingRes.content ?? "") as MovieListing;
		
		for(const id in listing) {
			movies.value.push(listing[id]);
		}
		movies.value.sort((left, right) => {
			return left.name.localeCompare(right.name);
		});
	});
</script>

<style scoped>
	.poster {
		display: inline-block;
	}
	.poster img {
		width: 212px;
	}
</style>
