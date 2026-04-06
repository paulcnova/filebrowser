
<template>
	<div class="movies-listing">
		<div class="movie-entry" v-for="movie in movies">
			<RouterLink :to="`/movies/${movie.id}`">
				<img :src="movie.poster"/>
				<span class="title">{{ movie.name }}</span>
				<div class="release-date">{{ getProperDate(movie.released) }}</div>
			</RouterLink>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { files as api } from "@/api";
	import { type MovieDetails, type MovieListing } from '@/interface/Listing';
	import { RouterLink, useRoute } from 'vue-router';
	
	const movies = ref<MovieDetails[]>([]);
	
	onMounted(async () => {
		const listingRes = await api.fetch("/movies/movies.listing.json", undefined, false);
		const listing = JSON.parse(listingRes.content ?? "") as MovieListing;
		
		for(const id in listing) {
			movies.value.push(listing[id]);
		}
		movies.value.sort((left, right) => {
			return left.name.localeCompare(right.name);
		});
	});
	
	function getProperDate(released: string): string {
		const match = released.match(/(\d{4})\-(\d{2})-(\d{2})/);
		
		if(match == null) { return released; }
		
		const month = [
			"Jan", "Feb", "Mar",
			"Apr", "May", "Jun",
			"Jul", "Aug", "Sep",
			"Oct", "Nov", "Dec",
		];
		
		return `${month[Number(match[2]) - 1]} ${Number(match[3])}, ${match[1]}`;
	}
</script>

<style scoped>
	.movies-listing {
		display: flex;
		gap: 10px;
		padding: 32px;
	}
	.movie-entry {
		display: inline-block;
	}
	.movie-entry a {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.movie-entry img {
		width: 212px;
	}
	.movie-entry .title,
	.movie-entry .release-date {
		font-size: 12px;
		width: 100%;
		max-width: 100%;
		text-align: center;
		text-overflow: ellipsis !important;
		white-space: nowrap !important;
		overflow: hidden !important;
	}
</style>
