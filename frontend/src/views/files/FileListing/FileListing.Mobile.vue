
<template>
	<div id="file-selection" :class="{ 'file-selection-margin-bottom': stores.file?.multiple }">
		<span v-if="(stores.file?.selectedCount ?? 0) > 0">
			{{ props.translate("prompts.filesSelected", (stores.file?.selectedCount ?? 0)) }}
		</span>
		<action
			v-if="props.headerButtons.share"
			icon="share"
			:label="props.translate('buttons.share')"
			show="share"
		/>
		<action
			v-if="props.headerButtons.rename"
			icon="mode_edit"
			:label="props.translate('buttons.rename')"
			show="rename"
		/>
		<action
			v-if="props.headerButtons.copy"
			icon="content_copy"
			:label="props.translate('buttons.copyFile')"
			show="copy"
		/>
		<action
			v-if="props.headerButtons.move"
			icon="forward"
			:label="props.translate('buttons.moveFile')"
			show="move"
		/>
		<action
			v-if="props.headerButtons.delete"
			icon="delete"
			:label="props.translate('buttons.delete')"
			show="delete"
		/>
	</div>
</template>

<script setup lang="ts">
	import type { HeaderButtons, Translator } from "@/interfaces";
	import requestStores from "@/utility/stores";
	
	const props = defineProps<{
		headerButtons: HeaderButtons,
		translate: Translator,
	}>();
	
	const stores = requestStores(["auth", "clipboard", "file", "layout"]);
</script>
