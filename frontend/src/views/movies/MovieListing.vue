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
	import { onMounted, ref, watch } from 'vue';
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
	const props = defineProps<{
		searchValue?: string,
		listing?: MovieDetails[],
	}>();
	
	onMounted(async () => {
		if(props.listing) {
			setupMovies();
		}
		else {
			const listingRes = await api.fetch("/movies/movies.listing.json", undefined, false);
			const listing = JSON.parse(listingRes.content ?? "") as MovieListing;
			
			for(const id in listing) {
				movies.value.push(listing[id]);
			}
			movies.value.sort((left, right) => {
				return left.name.localeCompare(right.name);
			});
		}
	});
	
	watch(props, () => {
		setupMovies();
	})
	
	function setupMovies() {
		if(props.listing) {
			const val = (props.searchValue ?? "").toLowerCase();
			
			movies.value = val != "" ? props.listing.filter(detail => {
				if(/(\d+h(\d+m)?|(\d+h)?\d+m)/.test(val)) {
					// TODO: Flesh this out better
					const time = Number(val.replace(/(?:(\d+)h)?(?:(\d+)m)?/, (_, hour, min) => {
						return (
							Number(hour ?? 0) * 60
							+ Number(min ?? 0)
						) + "";
					}));
					console.log(time);
					if(time > detail.runtime) { return true; }
				}
				if(detail.name.toLowerCase().indexOf(val) > -1) {
					return true;
				}
				if(detail.plot.toLowerCase().indexOf(val) > -1) {
					return true;
				}
				if(detail.studio.toLowerCase().indexOf(val) > -1) {
					return true;
				}
				if(detail.genre.findIndex(member => member.toLowerCase().indexOf(val) > -1) > -1) {
					return true;
				}
				if(detail.directors.findIndex(member => member.toLowerCase().indexOf(val) > -1) > -1) {
					return true;
				}
				if(detail.credits.findIndex(member => member.toLowerCase().indexOf(val) > -1) > -1) {
					return true;
				}
				if(detail.cast.findIndex(member => member.name.toLowerCase().indexOf(val) > -1 || member.role.toLowerCase().indexOf(val) > -1) > -1) {
					return true;
				}
			}) : props.listing;
		}
	}
	
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
		justify-content: center;
		gap: 10px;
		padding-inline: 20px;
		padding-block: 20px;
	}
</style>

<!-- Poster -->
<style scoped lang="scss">
	@use "sass:math";
	// Desktop
	.movie-entry {
		width: calc(25% - 80px);
		max-width: 250px;
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
		
		@media screen and (max-width: 768px) {
			width: calc(35% - 20px);
		}
		
		@media screen and (max-width: 425px) {
			width: calc(50% - 5px);
		}
	}
	
	.movie-entry > a {
		width: 100%;
	}
	
	.movie-entry img {
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
