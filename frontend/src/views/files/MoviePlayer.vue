
<template>
	<div id="previewer" @touchmove.prevent.stop @wheel.prevent.stop>
		<div class="preview" v-if="previewURL">
			<VideoPlayer
				:source="previewURL"
				:subtitles="subtitles"
				:autoplay="autoplay"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import VideoPlayer from '@/components/files/VideoPlayer.new.vue';
	import { useFileStore } from '@/stores/file';
	import { computed, onMounted, ref } from 'vue';
	import { files as api } from "@/api";
	import type { MovieListing } from '@/interface/Listing';
	import { useRoute } from 'vue-router';
	
	const route = useRoute();
	const fileStore = useFileStore();
	const previewURL = ref<string | null>(null);
	
	onMounted(async () => {
		const listingRes = await api.fetch("/movies/movies.listing.json");
		const listing = JSON.parse(listingRes.content ?? "") as MovieListing;
		const id = route.params.id.toString();
		const res = await api.fetch(listing[id].file);
		
		console.log(listing[id]);
		console.log(await api.fetch(listing[id].file));
		console.log(listing[id].file);
		previewURL.value = api.getDownloadURL(res, true);
	});
	const subtitles = computed(() => {
		if(fileStore.req?.subtitles) {
			return api.getSubtitlesURL(fileStore.req);
		}
		return [];
	});
	const autoplay = computed(() => {
		return false;
	});
</script>
