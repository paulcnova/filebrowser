
import { useAuthStore } from "@/stores/auth";
import { useClipboardStore } from "@/stores/clipboard";
import { useFileStore } from "@/stores/file";
import { useLayoutStore } from "@/stores/layout";

type StoreType =
	"auth"
	| "file"
	| "layout"
	| "clipboard";

const requestStores = (storeTypes: StoreType[]) => {
	return {
		auth: "auth" in storeTypes ? useAuthStore() : null,
		file: "file" in storeTypes ? useFileStore() : null,
		layout: "layout" in storeTypes ? useLayoutStore() : null,
		clipboard: "clipboard" in storeTypes ? useClipboardStore() : null,
	};
}

export default requestStores;
