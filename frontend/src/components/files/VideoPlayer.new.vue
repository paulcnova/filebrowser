
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
		<media-captions></media-captions>
		<!-- <media-video-layout class="default-vds-layout"></media-video-layout> -->
		<media-controls>
			<media-controls-group class="vds-controls-group top-group">
				<action icon="close" @action="close()"/>
				<span class="title">{{ name }}</span>
				<!-- <media-title>{{ name }}</media-title> -->
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
				<media-time-slider class="media-slider">
					<div class="media-slider-track">
						<div class="media-slider-track-fill media-slider-track"></div>
						<div class="media-slider-progress media-slider-track"></div>
					</div>
					<div class="media-slider-thumb"></div>
				</media-time-slider>
			</media-controls-group>
			
			<media-controls-group class="vds-controls-group bottom-group">
				<media-play-button class="media-button">
					<media-icon type="play" class="play-icon"></media-icon>
					<media-icon type="pause" class="pause-icon"></media-icon>
				</media-play-button>
				
				<media-mute-button class="vds-button">
					<media-icon type="mute" class="mute-icon vds-icon"></media-icon>
					<media-icon type="volume-low" class="volume-low-icon vds-icon"></media-icon>
					<media-icon type="volume-high" class="volume-high-icon vds-icon"></media-icon>
				</media-mute-button>
				
				<media-volume-slider class="media-slider">
					<div class="media-slider-track">
						<div class="media-slider-track-fill media-slider-track"></div>
					</div>
					<media-slider-preview class="media-slider-preview" noClamp>
						<media-slider-value class="media-slider-value" format="percent"></media-slider-value>
					</media-slider-preview>
					<div class="media-slider-thumb"></div>
				</media-volume-slider>
				
				<div class="media-time-group">
					<media-time class="media-time" type="current"></media-time>
					<div class="media-time-divider">/</div>
					<media-time class="media-time" type="duration"></media-time>
				</div>
				
				<div class="vds-controls-spacer"></div>
				
				<media-caption-button class="media-button">
					<media-icon type="closed-captions-on" class="cc-on-icon"></media-icon>
					<media-icon type="closed-captions" class="cc-off-icon"></media-icon>
				</media-caption-button>
				
				<media-fullscreen-button class="media-button">
					<media-icon type="fullscreen" class="fs-enter-icon"></media-icon>
					<media-icon type="fullscreen-exit" class="fs-exit-icon"></media-icon>
				</media-fullscreen-button>
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
		MediaMuteButtonElement,
		MediaTimeSliderElement,
		MediaTimeElement,
		MediaFullscreenButtonElement,
		MediaCaptionsElement,
		MediaCaptionButtonElement,
		MediaCaptionsRadioGroupElement,
		MediaVolumeSliderElement,
	} from "vidstack/elements";
	import type { MediaCanPlayEvent } from "vidstack/types/vidstack-tX8MEPiY.js";
	import { ref, onMounted, computed } from "vue";
	import { useScreenOrientation } from "@vueuse/core";
	import { useRoute, useRouter } from 'vue-router';
	import url from '@/utils/url';
	import { useAuthStore } from "@/stores/auth";
	import { useFileStore } from "@/stores/file";
	import { files as api } from "@/api";
	
	const videoPlayer = ref<HTMLElement | null>(null);
	const props = withDefaults(
		defineProps<{
			source: string,
			name?: string,
			subtitles?: string[],
			options?: any,
			autoplay?: boolean,
		}>(),
		{
			options: {},
		}
	);
	const name = ref<string>(props.name ?? "");
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
	defineCustomElement(MediaMuteButtonElement);
	defineCustomElement(MediaTimeElement);
	defineCustomElement(MediaTimeSliderElement);
	defineCustomElement(MediaFullscreenButtonElement);
	defineCustomElement(MediaCaptionsElement);
	defineCustomElement(MediaCaptionButtonElement);
	defineCustomElement(MediaVolumeSliderElement);
	defineCustomElement(MediaCaptionsRadioGroupElement);
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
	.title {
		flex-grow: 1;
		text-align: left;
		font-size: 1.4em;
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

<!-- Time Slider -->
<style scoped>
	.media-slider {
		display: inline-flex;
		align-items: center;
		width: 100%;
		height: 40px;
		position: relative;
		contain: layout style;
		outline: none;
		pointer-events: auto;
		cursor: pointer;
		user-select: none;
		touch-action: none;
		/* max-width: 72px; */
		/** Prevent thumb flowing out of slider (15px = thumb width). */
		margin: 0 calc(15px / 2);
		-webkit-user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	.media-slider[data-focus] .media-slider-track {
		box-shadow: var(--media-focus-ring, 0 0 0 3px rgb(78 156 246));
	}

	.media-slider-track {
		z-index: 0;
		position: absolute;
		width: 100%;
		height: 5px;
		top: 50%;
		left: 0;
		border-radius: 1px;
		transform: translateY(-50%) translateZ(0);
		background-color: rgb(255 255 255 / 0.3);
		contain: strict;
	}

	.media-slider-track-fill {
		z-index: 2; /** above progress. */
		background-color: #f5f5f5;
		width: var(--slider-fill, 0%);
		will-change: width;
	}

	.media-slider-progress {
		z-index: 1; /** above track. */
		width: var(--slider-progress, 0%);
		will-change: width;
		background-color: rgb(255 255 255 / 0.5);
	}

	.media-slider-thumb {
		position: absolute;
		top: 50%;
		left: var(--slider-fill);
		opacity: 0;
		contain: layout size style;
		width: 15px;
		height: 15px;
		border: 1px solid #cacaca;
		border-radius: 9999px;
		background-color: #fff;
		transform: translate(-50%, -50%) translateZ(0);
		transition: opacity 0.15s ease-in;
		pointer-events: none;
		will-change: left;
		z-index: 2; /** above track fill. */
	}

	.media-slider[data-active] .media-slider-thumb {
		opacity: 1;
		transition: opacity 0.2s ease-in;
	}

	.media-slider[data-dragging] .media-slider-thumb {
		box-shadow: 0 0 0 3px hsla(0, 0%, 100%, 0.4);
	}
</style>

<!-- Mute Button -->
<style scoped>
	.vds-button:not([data-muted]) .mute-icon,
	.vds-button:not([data-state='low']) .volume-low-icon,
	.vds-button:not([data-state='high']) .volume-high-icon
	{ display: none; }
</style>

<!-- Volume Slider -->
<style scoped>
	.media-slider {
		display: inline-flex;
		align-items: center;
		width: 100%;
		height: 40px;
		position: relative;
		contain: layout style;
		outline: none;
		pointer-events: auto;
		cursor: pointer;
		user-select: none;
		touch-action: none;
		/* max-width: 72px; */
		/** Prevent thumb flowing out of slider (15px = thumb width). */
		margin: 0 calc(15px / 2);
		-webkit-user-select: none;
		-webkit-tap-highlight-color: transparent;
	}
	
	media-volume-slider.media-slider { max-width: 72px; }

	.media-slider[data-focus] .media-slider-track {
		box-shadow: var(--media-focus-ring, 0 0 0 3px rgb(78 156 246));
	}

	.media-slider-track {
		z-index: 0;
		position: absolute;
		width: 100%;
		height: 5px;
		top: 50%;
		left: 0;
		border-radius: 1px;
		transform: translateY(-50%) translateZ(0);
		background-color: rgb(255 255 255 / 0.3);
		contain: strict;
	}

	.media-slider-track-fill {
		z-index: 2; /** above track. */
		background-color: #f5f5f5;
		width: var(--slider-fill, 0%);
		will-change: width;
	}

	.media-slider-thumb {
		position: absolute;
		top: 50%;
		left: var(--slider-fill);
		opacity: 0;
		contain: layout size style;
		width: 15px;
		height: 15px;
		border: 1px solid #cacaca;
		border-radius: 9999px;
		background-color: #fff;
		transform: translate(-50%, -50%) translateZ(0);
		transition: opacity 0.15s ease-in;
		pointer-events: none;
		will-change: left;
		z-index: 2; /** above track fill. */
	}

	.media-slider[data-active] .media-slider-thumb {
		opacity: 1;
		transition: opacity 0.2s ease-in;
	}
	
	.media-slider-preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		opacity: 0;
		border-radius: 2px;
		pointer-events: none;
		transition: opacity 0.2s ease-out;
		will-change: left, opacity;
		contain: layout paint style;
	}
	
	.media-slider-preview[data-visible] {
		opacity: 1;
		transition: opacity 0.2s ease-in;
	}
	
	.media-slider-value {
		padding: 1px 10px;
		color: white;
		background-color: black;
		border-radius: 2px;
	}
</style>

<!-- Time -->
<style scoped>
	.media-time-group {
		display: flex;
		align-items: center;
		margin-left: 8px;
	}
	
	.media-time {
		display: inline-block;
		contain: content;
		font-size: 14px;
		font-weight: 400;
		letter-spacing: 0.025em;
	}
	
	.media-time-divider {
		margin: 0 2.5px;
		color: #e0e0e0;
	}
</style>

<!-- Captions Button -->
<style scoped>
	.media-button[data-active] .cc-off-icon,
	.media-button:not([data-active]) .cc-on-icon
	{ display: none; }
</style>

<!-- Fullscreen Button -->
<style scoped>
	.media-button[data-active] .fs-enter-icon,
	.media-button:not([data-active]) .fs-exit-icon
	{ display: none; }
	
</style>

<!-- Captions -->
<style>
	media-captions {
		/* Recommended settings in the WebVTT spec (https://www.w3.org/TR/webvtt1). */
		--cue-color: var(--media-cue-color, white);
		--cue-bg-color: var(--media-cue-bg, rgba(0, 0, 0, 0.7));
		--cue-font-size: calc(var(--overlay-height) / 100 * 4.5);
		--cue-line-height: calc(var(--cue-font-size) * 1.2);
		--cue-padding-x: calc(var(--cue-font-size) * 0.6);
		--cue-padding-y: calc(var(--cue-font-size) * 0.4);
		position: absolute;
		inset: 0;
		z-index: 1;
		contain: layout style;
		margin: var(--overlay-padding);
		font-size: var(--cue-font-size);
		pointer-events: none;
		user-select: none;
		word-spacing: normal;
		word-break: break-word;
		bottom: 8px;
		transition: bottom 0.15s linear;
	}

	media-captions[aria-hidden='true'] {
		display: none;
	}

	media-captions [data-part='cue-display'] {
		position: absolute;
		direction: ltr;
		overflow: visible;
		contain: content;
		/* top: var(--cue-top);
		left: var(--cue-left);
		right: var(--cue-right);
		bottom: var(--cue-bottom); */
		top: unset;
		bottom: 8px;
		width: var(--cue-width, auto);
		height: var(--cue-height, auto);
		transform: var(--cue-transform);
		text-align: var(--cue-text-align);
		writing-mode: var(--cue-writing-mode, unset);
		white-space: pre-line;
		unicode-bidi: plaintext;
		min-width: min-content;
		min-height: min-content;
	}

	media-captions[data-dir='rtl'] [data-part='cue-display'] {
		direction: rtl;
	}

	media-captions [data-part='cue'] {
		display: inline-block;
		contain: content;
		border-radius: 2px;
		backdrop-filter: blur(8px);
		padding: var(--cue-padding-y) var(--cue-padding-x);
		line-height: var(--cue-line-height);
		background-color: var(--cue-bg-color);
		color: var(--cue-color);
		white-space: pre-wrap;
		outline: var(--cue-outline);
		text-shadow: var(--cue-text-shadow);
	}

	media-captions [data-part='cue-display'][data-vertical] [data-part='cue'] {
		padding: var(--cue-padding-x) var(--cue-padding-y);
	}

	/* Hide captions when interacting with time slider. */
	media-player[data-preview] media-captions {
		opacity: 0;
		visibility: hidden;
	}

	/* Push captions up when controls are visible. */
	media-player[data-controls] media-captions {
		bottom: 78px;
	}
</style>
