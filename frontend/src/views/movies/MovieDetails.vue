
<template>
	<div class="movie-details" v-if="props.details">
		<div class="backdrop" :style="`background-image: url('${props.details.thumbnail}');`">
			<div class="backdrop-overlay"></div>
		</div>
		<div class="content-outer">
			<div class="content">
				<Action icon="arrow_back" class="return" @action="close()"/>
				<img :src="props.details.poster" class="poster" />
				<div class="info">
					<div class="title">{{ props.details.name }}</div>
					<div class="details">
						<span><Action icon="play_arrow" class="play" @click="goToPlayer()"/></span>
						<span class="certification" v-if="props.details.certificate">{{ props.details.certificate }}</span>
						<span class="year">{{ getYear() }}</span>
						<span class="runtime">{{ getRuntime() }}</span>
						<span class="rating" v-if="props.details.ratings.tmdb">{{ getTMDBRating() }}</span>
					</div>
					<div class="labeled-details">
						<span class="info-label">
							<div class="label">Studio</div>
							<div class="info-details">{{ props.details.studio }}</div>
						</span>
						<span class="info-label">
							<div class="label">Genre</div>
							<div class="info-details">{{ props.details.genre.join(", ") }}</div>
						</span>
					</div>
					<div class="plot">
						{{ props.details.plot }}
					</div>
				</div>
			</div>
			
			<div class="parental-guide" v-if="props.details.parentalGuide">
				<div v-for="guide in [props.details.parentalGuide.sex, props.details.parentalGuide.violence, props.details.parentalGuide.profanity, props.details.parentalGuide.drugs, props.details.parentalGuide.scares]" :class="`guide-section ${guide.category} ${guide.severity.level}`">
					<span class="category" v-if="guide.category == 'sex'">Sex &amp; Nudity</span>
					<span class="category" v-else-if="guide.category == 'violence'">Violence &amp; Gore</span>
					<span class="category" v-else-if="guide.category == 'profanity'">Profanity</span>
					<span class="category" v-else-if="guide.category == 'drugs'">Alcohol, Drugs, &amp; Smoking</span>
					<span class="category" v-else-if="guide.category == 'scares'">Frightening &amp; Intense Scenes</span>
					<span class="severity">{{ guide.severity.voted }} / {{ guide.severity.max }} voted: {{ guide.severity.level }}</span>
				</div>
			</div>
			
			<div class="movie-info-type-a directors-section" v-if="props.details.directors.length > 0">
				<span class="movie-info-label">Director(s)</span>
				<span class="movie-info-content">{{ props.details.directors.join(", ") }}</span>
			</div>
			
			<div class="movie-info-type-a credits-section" v-if="props.details.credits.length > 0">
				<span class="movie-info-label">Credits</span>
				<span class="movie-info-content">{{ props.details.credits.join(", ") }}</span>
			</div>
			
			<div class="movie-info-type-b cast-section" v-if="props.details.cast.length > 0">
				<span class="movie-info-label">Cast</span>
				<span class="movie-info-content">
					<span class="movie-info-cast-block" v-for="member in props.details.cast">
						<span class="role-name">{{ member.role }}</span>
						<span class="actor-name">{{ member.name }}</span>
					</span>
				</span>
			</div>
			
			<div class="intentionally-blank" style="height:15vh;"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import Action from '@/components/header/Action.vue';
	import type { MovieDetails } from '@/interface/Listing';
	import router from '@/router';
	import url from '@/utils/url';
	import { useRoute } from 'vue-router';
	
	const props = defineProps<{
		details?: MovieDetails,
	}>();
	const route = useRoute();
	const close = () => {
		const uri = url.removeLastDir(route.path);
		
		router.push({ path: uri, query: route.query });
	};
	function getYear(): string {
		if(!props.details) { return ""; }
		return props.details.released.substring(0, 4);
	}
	
	function getRuntime(): string {
		if(!props.details) { return ""; }
		
		const hours = Math.floor(props.details.runtime / 60);
		const minutes = props.details.runtime - (hours * 60);
		const result = `${minutes.toString().padStart(2, '0')}m`;
		
		if(hours == 0) { return result;}
		
		return `${hours}h ${result}`;
	}
	
	function getTMDBRating(): string {
		const val = (props.details?.ratings.tmdb?.value || 0) * 10.0;
		
		return val.toFixed(1) + "%";
	}
	
	function goToPlayer(): void {
		router.push({ path: `${route.path}/view` });
	}
</script>

<!-- Backdrop -->
<style scoped>
	.movie-details {
		position: relative;
		width: 100%;
		min-height: calc(100vh - 4em);
		background-color: rgba(0, 0, 0, 0.7);
	}
	
	.movie-details .backdrop {
		position: fixed;
		z-index: -1;
		width: 100vw;
		height: 100vh;
		background-size: cover;
		background-position-x: center;
		aspect-ratio: 16/9;
		max-height: calc(100vh - 4em);
	}
	
	.movie-details .backdrop-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
	}
</style>

<!-- Content Outer -->
<style scoped>
	/* Desktop */
	.content-outer {
		width: 100%;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: start;
		align-content: stretch;
		justify-content: start;
		row-gap: 16px;
		padding-inline: 32px;
		padding-block: 32px;
		flex: 1;
	}
</style>

<!-- Action Buttons -->
<style>
	.movie-details button.return {
		position: absolute;
		top: 16px;
		left: 16px;
		z-index: 4;
	}
	
	.movie-details button.play {
		width: 64px !important;
		height: 64px !important;
	}
	
	.movie-details button.play i {
		font-size: 40px !important;
		padding: 12px !important;
	}
	
	.movie-details button.action {
		width: 32px;
		height: 32px;
		background-color: white;
		border-radius: 50%;
	}
	
	.movie-details button.action:hover
	{ background-color: dimgray; }
	
	.movie-details button.action:hover i
	{ color: white !important; }
	
	.movie-details button.action i {
		padding: 4px;
		color: black !important;
	}
</style>

<!-- Content -->
<style scoped lang="scss">
	/* Desktop */
	.content {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: start;
		align-content: stretch;
		justify-content: start;
		column-gap: 36px;
		min-block-size: 368px;
		
		.poster {
			width: 250px;
			height: 368px;
			flex-shrink: 0;
		}
		
		.info {
			height: auto;
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			align-items: start;
			align-content: stretch;
			justify-content: start;
			row-gap: 16px;
			min-block-size: 292px;
			flex: 1;
			
			.title {
				width: 100%;
				height: 64px;
				color: white;
				font-size: 50px;
				flex-shrink: 0;
			}
			
			.details {
				width: 100%;
				height: auto;
				display: flex;
				flex-direction: row;;
				flex-wrap: nowrap;
				align-items: center;
				align-content: stretch;
				justify-content: start;
				column-gap: 16px;
				min-block-size: 64px;
				
				.certification {
					padding: 0px 6px;
					border: 1px solid white;
					border-radius: 6px;
					font-size: 20px;
					font-weight: 300;
					min-block-size: 24px;
					min-inline-size: 32px;
				}
				
				.year, .runtime, .rating {
					font-size: 20px;
					flex-shrink: 0;
				}
			}
			
			.labeled-details {
				width: 100%;
				height: auto;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: start;
				align-content: stretch;
				justify-content: start;
				column-gap: 28px;
				
				.info-label {
					display: flex;
					flex-direction: column;
					flex-wrap: nowrap;
					align-items: start;
					align-content: stretch;
					justify-content: start;
					
					.label {
						width: 100%;
						height: 10px;
						color: #aaa;
						font-size: 10px;
						flex-shrink: 0;
					}
					
					.info-details {
						width: 100%;
						height: 20px;
						color: white;
						font-size: 16px;
						flex-shrink: 0;
					}
				}
			}
			
			.plot {
				width: 100%;
				height: 86px;
				color: white;
				font-size: 16px;
				flex-shrink: 0;
			}
		}
	}
</style>

<!-- Parental Guide -->
<style scoped lang="scss">
	.parental-guide {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: start;
		align-content: stretch;
		justify-content: start;
		gap: 16px;
		padding-inline: 8px;
		padding-block: 8px;
		
		.guide-section {
			height: 45px;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: start;
			align-content: stretch;
			justify-content: space-between;
			padding-inline: 16px;
			padding-block: 8px;
			flex: 1;
			
			&.none { background-color: gray; }
			&.mild { background-color: green; }
			&.moderate { background-color: goldenrod; }
			&.severe { background-color: red; }
			
			.category {
				height: 100%;
				color: white;
				font-size: 15px;
				flex-shrink: 0;
				flex: 1;
				align-content: center;
			}
			
			.severity {
				height: 100%;
				color: white;
				font-size: 12px;
				flex-shrink: 0;
				flex: 1;
				align-content: center;
				text-align: right;
			}
		}
	}
</style>

<!-- Movie Credits -->
<style scoped lang="scss">
	.movie-info-type-a,
	.movie-info-type-b {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: start;
		align-content: stretch;
		justify-content: start;
		justify-content: start;
		column-gap: 28px;
		
		.movie-info-label {
			width: 72px;
			min-height: 28px;
			color: #aaa;
			font-size: 12px;
			flex-shrink: 0;
			text-align: center;
			align-items: center;
			align-content: center;
		}
		
		.movie-info-content {
			min-height: 28px;
			color: white;
			font-size: 16px;
			flex-shrink: 0;
			flex: 1;
			text-align: left;
			align-items: start;
			align-content: center;
		}
	}
	
	.movie-info-type-b .movie-info-content {
		height: auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		align-content: stretch;
		justify-content: space-between;
		gap: 16px;
		padding-inline: 16px;
		flex: 1;
		
		.movie-info-cast-block {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			align-items: start;
			align-content: stretch;
			justify-content: start;
			min-height: 36px;
			min-width: 162px;
			padding: 8px ;
			background-color: #123d;
			
			.role-name {
				width: 100%;
				height: 16px;
				color: #aaa;
				font-size: 12px;
				flex-shrink: 0;
				text-align: center;
			}
			
			.actor-name {
				width: 100%;
				height: 20px;
				color: white;
				font-size: 14px;
				flex-shrink: 0;
				text-align: center;
			}
		}
	}
</style>
