<template>
	<div id="previewer" @touchmove.prevent.stop @wheel.prevent.stop>
		<div class="preview" v-if="props.details">
			<VideoPlayer
				:source="`${origin}/api/raw/${props.details.file}`"
				:autoplay="autoplay"
				:subtitles="subtitles"
				:name="props.details?.name"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import VideoPlayer from '@/components/files/VideoPlayer.new.vue';
	import { computed, onMounted, ref } from 'vue';
	import { files as api } from "@/api";
	import type { MovieDetails, MovieListing } from '@/interface/Listing';
	import { origin } from '@/utils/constants';
	import { useRoute } from 'vue-router';
	
	const route = useRoute();
	const props = defineProps<{
		details?: MovieDetails
	}>();
	const response = ref<Resource>();
	
	onMounted(async () => {
		if(!props.details) {
			const listingRes = await api.fetch("/movies/movies.listing.json", undefined, false);
			const listing = JSON.parse(listingRes.content ?? "") as MovieListing;
			const id = route.params.id.toString();
			
			response.value = await api.fetch(listing[id].file, undefined, false);
		}
		else {
			response.value = await api.fetch(props.details.file, undefined, false);
		}
	});
	const subtitles = computed(() => {
		if(props.details == undefined) { return []; }
		if(response.value == undefined) { return []; }
		
		if(response.value.subtitles) {
			return api.getSubtitlesURL(response.value);
		}
		return [];
	});
	const autoplay = computed(() => {
		return false;
	});
</script>
