
<template>
	<div id="previewer" @touchmove.prevent.stop @wheel.prevent.stop>
		<div class="preview">
			<VideoPlayer
				v-if="fileStore.req?.type == 'video'"
				:source="previewURL"
				:subtitles="subtitles"
				:options="videoOptions"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import VideoPlayer from '@/components/files/VideoPlayer.new.vue';
	import { useFileStore } from '@/stores/file';
	import { computed, ref } from 'vue';
	import { files as api } from "@/api";
	
	const fullSize = ref<boolean>(false);
	const fileStore = useFileStore();
	const previewURL = computed(() => {
		if(!fileStore.req) { return ""; }
		
		if(fileStore.req.type === "image" && !fullSize.value) {
			return api.getDownloadURL(fileStore.req, "big");
		}
		return api.getDownloadURL(fileStore.req, true);
	});
	const subtitles = computed(() => {
		if(fileStore.req?.subtitles) {
			return api.getSubtitlesURL(fileStore.req);
		}
		return [];
	});
	const videoOptions = computed(() => {
		return { autoplay: true };
	});
</script>
