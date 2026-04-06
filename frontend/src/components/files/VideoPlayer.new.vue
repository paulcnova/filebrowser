
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
			<media-controls-group class="vds-controls-group top-group">
				<action icon="close" @action="close()"/>
				<media-title>{{ name }}</media-title>
				<action v-if="authStore.user?.perm.download"
					icon="open_in_new"
					@action="openDirect"
				/>
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
			<media-controls-group class="vds-controls-group bottom-above-group">
				
			</media-controls-group>
			<media-controls-group class="vds-controls-group bottom-group">
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
	import {
		defineCustomElement,
		MediaControlsElement,
		MediaControlsGroupElement,
		MediaPlayButtonElement,
		MediaPlayerElement,
		MediaSeekButtonElement,
		MediaVideoLayoutElement,
		MediaTitleElement,
	} from "vidstack/elements";
	import type { MediaCanPlayEvent } from "vidstack/types/vidstack-tX8MEPiY.js";
	import { ref, onMounted, computed } from "vue";
	import { useScreenOrientation } from "@vueuse/core";
	import { useRoute, useRouter } from 'vue-router';
	import url from '@/utils/url';
	import { useAuthStore } from "@/stores/auth";
	import { useFileStore } from "@/stores/file";
	import { files as api } from "@/api";
	
	const name = ref<string>("");
	const videoPlayer = ref<HTMLElement | null>(null);
	const props = withDefaults(
		defineProps<{
			source: string,
			subtitles?: string[],
			options?: any,
			autoplay?: boolean,
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
		try {
			instance?.play();
		} catch {}
	};
	const route = useRoute();
	const router = useRouter();
	const authStore = useAuthStore();
	const fileStore = useFileStore();
	const close = () => {
		const uri = url.removeLastDir(route.path) + '/';
		router.push({ path: uri });
	};
	const directURL = computed(() => fileStore.req
		? api.getDownloadURL(fileStore.req, true)
		: ""
	);
	const openDirect = () => window.open(directURL.value);
	
	defineCustomElement(MediaVideoLayoutElement);
	defineCustomElement(MediaPlayerElement);
	defineCustomElement(MediaControlsElement);
	defineCustomElement(MediaControlsGroupElement);
	defineCustomElement(MediaPlayButtonElement);
	defineCustomElement(MediaSeekButtonElement);
	defineCustomElement(MediaTitleElement);
	
	onMounted(() => {
		const dirs = route.fullPath.split("/");
		const fileName = dirs[dirs.length - 1];
		const fileNameNoExtension = fileName.substring(0, fileName.lastIndexOf('.'));
		
		name.value = decodeURIComponent(fileNameNoExtension);
	});
</script>

<style>
	.action i
	{ color: var(--video-player-menu-color) !important; }
	:root {
		--video-player-menu-color: #d4d4d4;
		--media-button-color: var(--video-player-menu-color);
		--media-controls-color: var(--video-player-menu-color);
		--media-time-color: var(--video-player-menu-color);
		--default-color: var(--video-player-menu-color);
		--media-slider-bg: var(--video-player-menu-color);
	}
</style>

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
		outline: 1px solid black;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		opacity: 0;
		transition: opacity 0.2s ease-out;
	}
	
	media-controls-group.top-group media-title {
		width: 100%;
		text-align: left;
		margin: 0 32px;
		color: #e3e3e3;
	}
	
	media-controls-group.center-group
	{ justify-content: center; }

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
		.media-button:hover
		{ background-color: rgb(255 255 255 / 0.2); }
	}

	.media-button[data-paused] .pause-icon,
	.media-button:not([data-paused]) .play-icon
	{ display: none; }

</style>
