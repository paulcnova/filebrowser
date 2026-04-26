
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
			<div class="ratings-section" v-if="props.details.parentalGuide">
				<div v-for="guide in [props.details.parentalGuide.sex, props.details.parentalGuide.violence, props.details.parentalGuide.profanity, props.details.parentalGuide.drugs, props.details.parentalGuide.scares]" :class="`parental-guide ${guide.category}`">
					<div :class="`banner ${guide.severity.level}`">
						<div class="cat-vote">
							<span v-if="guide.category == 'sex'" class="category">Sex &amp; Nudity</span>
							<span v-else-if="guide.category == 'violence'" class="category">Violence &amp; Gore</span>
							<span v-else-if="guide.category == 'profanity'" class="category">Profanity</span>
							<span v-else-if="guide.category == 'drugs'" class="category">Alcohol, Drugs &amp; Smoking</span>
							<span v-else-if="guide.category == 'scares'" class="category">Frightening &amp; Intense Scenes</span>
							<span class="votes">{{ guide.severity.voted }} / {{ guide.severity.max }} voted</span>
						</div>
						<div class="severity-level">{{ guide.severity.level }}</div>
					</div>
					<div v-for="review in guide.reviews">
						<span v-if="!review.startsWith('[!SPOILER]')">{{ review }}</span>
						<span v-else class="spoiler" @click="(ev: any) => ev.target.parentElement.classList.toggle('view')">
							<span class="spoiler-declaration">SPOILER</span>
							<span class="spoiler-content">{{ review.substring('[!SPOILER]'.length) }}</span>
						</span>
					</div>
				</div>
			</div>
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
	
	function goToPlayer(): void {
		router.push({ path: `${route.path}/view` });
	}
</script>

<style>
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
	
	.movie-details .content {
		display: flex;
		width: 100%;
		height: 100%;
	}
	
	.movie-details .content-outer {
		display: flex;
		width: 100%;
		height: 100%;
		padding: 32px;
		flex-direction: column;
		color: white;
	}
	
	.movie-details img.poster {
		width: 250px;
		height: 368px;
		margin-right: 36px;
		z-index: 2;
		flex-shrink: 0;
	}
	
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
	
	.movie-details .info {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}
	
	.movie-details .info .title {
		font-weight: 300;
		font-size: 50px;
		line-height: 60px;
		margin-bottom: 6px;
	}
	
	.movie-details .info .details {
		padding-left: 7px;
		margin-bottom: 8px;
		font-weight: 300;
		font-size: 20px;
	}
	
	.movie-details .info .details .certification {
		border: 1px solid;
		border-radius: 5px;
		padding: 0 5px;
		margin-right: 15px;
	}
	
	.movie-details .info .details > span
	{ margin-right: 14px; }
	
	.movie-details .info .info-label {
		margin: 6px 12px 6px 0;
		padding: 4px 8px;
		font-size: 14px;
		display: inline-block;
		line-height: 1;
	}
	
	.movie-details .info .info-label .label {
		margin-bottom: 2px;
		color: #aaa;
		font-size: 10px;
	}
	
	.movie-details .info .info-label .info-details {
		font-weight: 300;
		font-size: 16px;
	}
	
	.movie-details .info .plot {
		flex: 1 0 0;
		margin-top: 8px;
		text-wrap: balance;
		font-size: 15px;
	}
</style>

<!-- Parental Guide -->
<style scoped>
	.parental-guide {
		display: flex;
		padding: 1em;
		flex-direction: column;
		gap: 8px;
	}
	
	.parental-guide .banner {
		display: flex;
		padding: 4px 8px;
		padding-right: 16px;
		align-content: space-between;
		align-items: stretch;
		justify-content: space-between;
	}
	
	.banner.none { background-color: gray; }
	.banner.mild { background-color: green; }
	.banner.moderate { background-color: goldenrod; }
	.banner.severe { background-color: red; }
	
	.parental-guide .votes {
		margin-left: 16px;
		font-size: 12px;
	}
	
	.parental-guide .spoiler {
		cursor: pointer;
		z-index: -1;
	}
	
	.parental-guide .spoiler .spoiler-declaration {
		background-color: #4d4d4d;
		color: white;
		padding-inline: 8px;
		border-radius: 8px;
	}
	
	.parental-guide .spoiler:not(.view) .spoiler-content {
		filter: blur(4px);
	}
</style>
