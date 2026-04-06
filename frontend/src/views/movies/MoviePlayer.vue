
<template>
	<div id="previewer" @touchmove.prevent.stop @wheel.prevent.stop>
		<div class="preview" v-if="previewURL">
			<VideoPlayer
				:source="previewURL"
				:autoplay="autoplay"
				:subtitles="subtitles"
				@back="close"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import VideoPlayer from '@/components/files/VideoPlayer.new.vue';
	import { useFileStore } from '@/stores/file';
	import { computed, onMounted, ref } from 'vue';
	import { files as api } from "@/api";
	import type { MovieDetails, MovieListing } from '@/interface/Listing';
	import { useRoute } from 'vue-router';
	
	const route = useRoute();
	const fileStore = useFileStore();
	const previewURL = ref<string | null>(null);
	const props = defineProps<{
		details?: MovieDetails
	}>();
	const emit = defineEmits(["update"]);
	const response = ref<Resource>();
	
	onMounted(async () => {
		if(!props.details) {
			const listingRes = await api.fetch("/movies/movies.listing.json");
			const listing = JSON.parse(listingRes.content ?? "") as MovieListing;
			const id = route.params.id.toString();
			
			response.value = await api.fetch(listing[id].file);
			
			previewURL.value = api.getDownloadURL(response.value, true);
		}
		else {
			response.value = await api.fetch(props.details.file);
			
			previewURL.value = api.getDownloadURL(response.value, true);
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
	
	function close(): void {
		emit("update", props.details?.id);
	}
</script>
