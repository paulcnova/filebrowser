
export interface HeaderButtons {
	upload?: boolean,
	download?: boolean,
	shell?: boolean,
	delete?: boolean,
	rename?: boolean,
	share?: boolean,
	move?: boolean,
	copy?: boolean,
}

export type Translator = (key: number | string, plural?: number) => string;
