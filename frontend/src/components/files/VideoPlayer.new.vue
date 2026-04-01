
<template>
	<media-player :ref="videoPlayer" @can-play="canPlay" :src="source" stream-type="on-demand" controls class="video-max" preload="auto">
		<media-provider>
			<source />
			<track kind="subtitles"
				v-for="(sub, index) in subtitles"
				:key="index"
				:src="sub"
				:label="subLabel(sub)"
				:default="index === 0"
			/>
		</media-provider>
		<media-video-layout>
			<!-- <media-play-button class="vds-button">
				<media-icon type="play" class="play-icon vds-icon"></media-icon>
				<media-icon type="pause" class="pause-icon vds-icon"></media-icon>
			</media-play-button>
			<media-caption-button class="vds-button">
				<media-icon type="closed-captions-on" class="cc-on-icon vds-icon"></media-icon>
				<media-icon type="closed-captions" class="cc-off-icon vds-icon"></media-icon>
			</media-caption-button> -->
		</media-video-layout>
	</media-player>
</template>

<script setup lang="ts">
	import "vidstack/bundle";
	import type { MediaCanPlayEvent } from "vidstack/types/vidstack-tX8MEPiY.js";
	import { ref, onMounted } from "vue";
	import { useScreenOrientation } from "@vueuse/core";
	
	const videoPlayer = ref<HTMLElement | null>(null);
	const props = withDefaults(
		defineProps<{
			source: string,
			subtitles?: string[],
			options?: any,
		}>(),
		{
			options: {},
		}
	);
	const source = ref(props.source);
	const subLabel = (subURL: string) => {
		let url: URL;
		try {
			url = new URL(subURL);
		} catch {
			url = new URL(subURL, window.location.origin);
		}
		
		return decodeURIComponent(
			url.pathname
				.split("/")
				.pop()!
				.replace(/\.[^/.]+$/, "")
		);
	};
	const canPlay = async (ev: MediaCanPlayEvent) => {
		const instance = document.querySelector("media-player");
		const {
			isSupported,
			lockOrientation
		} = useScreenOrientation();
		
		try {
			if(isSupported.value === true) {
				await lockOrientation("landscape");
			}
		} catch {}
		instance?.controls.show();
		instance?.play();
	};
	
	onMounted(() => {
		const instance = document.querySelector("media-player");
		
		console.dir(instance);
	});
</script>
<style scoped>
	.video-max {
		width: 100%;
		height: 100%;
	}
</style>
