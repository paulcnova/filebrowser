
<template>
	<div class="movies-listing">
		<div class="options">
			<Action icon="chevron_left" class="back"/>
			<div class="options-container">
				<DropdownModal>
					<div>{{ currentSorting }}</div>
					<template v-slot:list>
						<button v-for="item in Object.keys(sortByItems)"
							:key="item"
							:value="item"
							class="sort-button-item"
							@click="updateSorting(item, (sortByItems as any)[item])">
							{{ item }}
						</button>
					</template>
				</DropdownModal>
			</div>
		</div>
		<div class="content">
			<div class="movie-entry" v-for="movie in movies">
				<RouterLink :to="`/movies/${movie.id}`">
					<img :src="movie.poster"/>
					<div class="title">{{ movie.name }}</div>
					<div class="release-date">{{ getProperDate(movie.released) }}</div>
				</RouterLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { files as api } from "@/api";
	import { type MovieDetails, type MovieListing } from '@/interface/Listing';
	import { RouterLink } from 'vue-router';
	import Action from '@/components/header/Action.vue';
	import DropdownModal from '@/components/DropdownModal.vue';
	
	const movies = ref<MovieDetails[]>([]);
	const sortByItems = {
		Name: (inv: number) => movies.value.sort((left, right) => inv * left.name.localeCompare(right.name)),
		Date: (inv: number) => movies.value.sort((left, right) => inv * left.released.localeCompare(right.released)),
		Rating: (inv: number) => movies.value.sort((left, right) => inv * (right.ratings.tmdb?.value ?? 0) - (left.ratings.tmdb?.value ?? 0)),
	};
	const currentSorting = ref<string>("Name");
	const isAscending = ref<boolean>(true);
	
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
	
	function updateSorting(name: string, func: (inv: number) => void) {
		const asc = currentSorting.value != name || !isAscending.value;
		currentSorting.value = name;
		isAscending.value = asc;
		func(isAscending.value ? 1 : -1);
	}
	
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

<!-- Options -->
<style scoped>
	/* Desktop */
	.options {
		width: 100%;
		height: 48px;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: start;
		align-content: stretch;
		justify-content: space-between;
		column-gap: 16px;
		padding-inline: 24px;
		padding-block: 8px;
	}
</style>

<!-- Content -->
<style scoped>
	/* Desktop */
	.content {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 1fr 1fr;
		align-items: start;
		align-content: start;
		justify-items: start;
		justify-content: start;
		gap: 10px;
		padding-inline: 20px;
		padding-block: 20px;
	}
</style>

<!-- Poster -->
<style scoped>
	/* Desktop */
	.movie-entry {
		width: 144px;
		height: 252px;
		border-radius: 16px;
		background-color: #6f4e2e;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: start;
		align-content: stretch;
		justify-content: start;
		flex-shrink: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.movie-entry > a {
		width: 100%;
	}
	
	.movie-entry img {
		width: 144px;
		height: 212px;
		flex-shrink: 0;
	}
	
	.movie-entry .title, .movie-entry .release-date {
		width: 100%;
		flex-shrink: 0;
		display: block;
		text-align: center;
	}
	
	.movie-entry .title {
		height: 18px;
		font-size: 12px;
	}
	
	.movie-entry .release-date {
		height: 16px;
		font-size: 10px;
	}
</style>

<!-- <style scoped>
	.sort-button-item {
		display: block;
		background: none;
		color: white;
		border: none;
		width: 100%;
		height: 32px;
		text-align: left;
		cursor: pointer;
	}
</style>

<style scoped>
	@media (max-width: 960px) {
		.movies-listing {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			align-items: start;
			align-content: stretch;
			justify-content: space-between;
			flex-grow: 1;
			margin-top: 1em;
		}
		
		.options {
			width: 100%;
			height: 48px;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: start;
			align-content: stretch;
			justify-content: space-between;
			column-gap: 16px;
			padding-inline-start: 24px;
			padding-inline-end: 24px;
			padding-block-start: 8px;
			padding-block-end: 8px;
		}
		
		.options .back {
			width: 32px;
			height: 32px;
			background-color: #fff;
			flex-shrink: 0;
		}
		
		.options-container {
			height: 32px;
			display: flex;
			flex-direction: row-reverse;
			flex-wrap: nowrap;
			align-items: start;
			align-content: stretch;
			justify-content: end;
			column-gap: 16px;
			flex-shrink: 0;
			flex: 1;
		}
		
		.options-container a {
			width: 32px;
			height: 32px;
			border-radius: 8px;
			background-color: #fff;
			flex-shrink: 0;
		}
		
		.content {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			grid-template-rows: 1fr 1fr;
			grid-template-columns: 1fr 1fr;
			align-items: start;
			align-content: stretch;
			justify-items: start;
			justify-content: start;
			flex-shrink: 0;
		}
		
		.content .movies {
			height: 100%;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			grid-template-rows: 1fr 1fr;
			grid-template-columns: 1fr 1fr;
			align-items: start;
			align-content: start;
			justify-items: start;
			justify-content: start;
			gap: 10px;
			padding-inline: 20px;
			padding-block: 20px;
			flex: 1;
		}
		
		.content .movies .movie-entry {
			width: 144px;
			height: 252px;
			background-color: #fff;
			display: flex;
			flex-direction: column-reverse;
			flex-wrap: nowrap;
			align-items: start;
			align-content: stretch;
			justify-content: start;
			flex-shrink: 0;
			border-radius: 8px;
			overflow: hidden;
		}
		
		.content .movies .movie-entry:hover {
			z-index: 2;
			box-shadow: 0 0 16px dodgerblue;
			transition: all 200ms ease-in;
		}
		
		.content .movies .movie-entry > a {
			width: 144px;
		}
		
		.content .movies .movie-entry img {
			width: 144px;
			height: 212px;
			flex-shrink: 0;
		}
		
		.content .movies .movie-entry .title,
		.content .movies .movie-entry .release-date {
			display: block;
			width: 100%;
			height: 24px;
			color: #000;
			font-size: 12px;
			font-weight: 400;
			line-height: 1.2;
			flex-shrink: 0;
			text-align: center;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			padding: 0 6px;
		}
		
		.content .movies .movie-entry .release-date {
			font-size: 10px;
			height: 16px;
		}
	}
</style> -->

<!-- <style scoped>
	.movies-listing {
		display: flex;
		gap: 10px;
	}
	
	.movie-entry-container {
		display: flex;
		flex-wrap: wrap;
		padding: 32px;
		justify-content: center;
	}
	
	.left-sidebar {
		/* width: 280px;
		background: navy; */
		flex: none;
	}
	
	.movie-entry {
		display: inline-block;
		width: 173px;
		height: 279px;
	}
	.movie-entry a {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.movie-entry img {
		width: 153px;
		height: 226px;
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
</style> -->
