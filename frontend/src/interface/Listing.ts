
export interface MovieListing {
	[id: string]: MovieDetails,
}

export interface MovieDetails {
	id: string,
	name: string,
	genre: string[],
	plot: string,
	tagline: string,
	poster: string,
	thumbnail: string,
	favorite: string[],
	file: string,
	released: string,
	runtime: number,
	studio: string,
	director: string,
	cast: {
		name: string,
		role: string,
		thumbnail?: string,
	}[],
	ratings: {
		tmdb?: {
			value: number,
			votes: number,
		}
	},
}
