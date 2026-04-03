
<template>
	<media-player :ref="videoPlayer" @can-play="canPlay" :src="source" stream-type="on-demand" class="video-max" preload="auto">
		<media-provider>
			<source />
			<track kind="subtitles"
				v-for="(sub, index) in subtitles"
				:key="index"
				:src="sub"
				:label="subLabel(sub)"
				:default="index == 0"
			/>
		</media-provider>
		<media-video-layout class="default-vds-layout"></media-video-layout>
		<media-controls>
			<media-controls-group class="vds-controls-group">
				<action icon="close" @action="close()"/>
			</media-controls-group>
			<div class="vds-controls-spacer"></div>
			<media-controls-group class="vds-controls-group center-group">
				<media-seek-button seconds="-10" class="media-button">
					<media-icon type="seek-backward-10"></media-icon>
				</media-seek-button>
				
				<media-play-button class="media-button large">
					<media-icon type="play" class="play-icon"></media-icon>
					<media-icon type="pause" class="pause-icon"></media-icon>
				</media-play-button>
				
				<media-seek-button seconds="+10" class="media-button">
					<media-icon type="seek-forward-10"></media-icon>
				</media-seek-button>
				
			</media-controls-group>
			<div class="vds-controls-spacer"></div>
			<media-controls-group class="vds-controls-group">
				<!-- <media-play-button class="media-button">
					<media-icon type="play" class="play-icon"></media-icon>
					<media-icon type="pause" class="pause-icon"></media-icon>
				</media-play-button> -->
			</media-controls-group>
		</media-controls>
	</media-player>
</template>

<script setup lang="ts">
	import "vidstack/bundle";
	import "vidstack/icons";
	import Action from "../header/Action.vue";
	import { defineCustomElement, MediaControlsElement, MediaControlsGroupElement, MediaPlayButtonElement, MediaPlayerElement, MediaSeekButtonElement, MediaVideoLayoutElement } from "vidstack/elements";
	import type { MediaCanPlayEvent } from "vidstack/types/vidstack-tX8MEPiY.js";
	import { ref, onMounted } from "vue";
	import { useScreenOrientation } from "@vueuse/core";
	import { useRoute, useRouter } from 'vue-router';
	import url from '@/utils/url';
	
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
	const route = useRoute();
	const router = useRouter();
	const close = () => {
		const uri = url.removeLastDir(route.path) + '/';
		router.push({ path: uri });
	};
	
	defineCustomElement(MediaVideoLayoutElement);
	defineCustomElement(MediaPlayerElement);
	defineCustomElement(MediaControlsElement);
	defineCustomElement(MediaControlsGroupElement);
	defineCustomElement(MediaPlayButtonElement);
	defineCustomElement(MediaSeekButtonElement);
</script>

<style scoped>
	.video-max {
		width: 100%;
		height: 100%;
	}
	.vds-controls {
		--media-controls-padding: 0px;
		--media-controls-in-transition: opacity 0.2s ease-in;
		--media-controls-out-transition: opacity 0.2 ease-out;
	}
	media-controls {
  display: flex;
  flex-direction: column;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s ease-out;
}

media-controls-group.center-group {
	justify-content: center;
}

media-controls[data-visible] {
  opacity: 1;
  background-image: linear-gradient(
    to top,
    rgb(0 0 0 / 0.5),
    10%,
    transparent,
    95%,
    rgb(0 0 0 / 0.3)
  );
}

media-controls-group {
  display: flex;
  align-items: center;
  width: 100%;
  padding-inline: 8px;
}

.media-controls-spacer {
  flex: 1 1 0%;
  pointer-events: none;
}








.media-button {
  display: inline-flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  color: white;
  border-radius: 8px;
  margin-right: 2.5px;
  cursor: pointer;
  /* Browser resets. */
  padding: 0;
  user-select: none;
  appearance: none;
  background: none;
  outline: none;
  border: none;
  touch-action: manipulation;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.media-button.large {
	width: 80px;
	height: 80px;
}

.media-button > media-icon {
  width: 80%;
  height: 80%;
  border-radius: 2px;
}

.media-button[data-focus] > media-icon {
  box-shadow: var(--media-focus-ring);
}

@media (hover: hover) and (pointer: fine) {
  .media-button:hover {
    background-color: rgb(255 255 255 / 0.2);
  }
}

.media-button[data-paused] .pause-icon,
.media-button:not([data-paused]) .play-icon {
  display: none;
}

</style>
