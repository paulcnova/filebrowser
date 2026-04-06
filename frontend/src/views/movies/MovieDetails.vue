
<template>
	<Action icon="arrow_back" @action="close()"/>
	<div class="movie-details" v-if="props.details">
		<img :src="props.details.poster" class="poster" />
		<div class="title">{{ props.details.name }}</div>
		<p class="plot">{{ props.details.plot }}</p>
		<RouterLink :to="`/movies/${props.details.id}/view`" @click="emit('update', props.details.id, 'view')">
			<Action icon="arrow_forward"/>
		</RouterLink>
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
	const emit = defineEmits(["update"]);
	const route = useRoute();
	const close = () => {
		const uri = url.removeLastDir(route.path);
		
		router.push({ path: uri, query: route.query });
		emit("update");
	};
</script>

<style scoped>
	.movie-details {
		display: flex;
	}
	
	.movie-details img.poster {
		width: 212px;
	}
</style>
