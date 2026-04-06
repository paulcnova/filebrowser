
export interface MovieListing {
	[id: string]: MovieDetails,
}

export interface MovieDetails {
	id: string,
	imdbID: string,
	name: string,
	genre: string[],
	plot: string,
	tagline: string,
	poster: string,
	thumbnail: string,
	file: string,
	released: string,
	runtime: number,
	studio: string,
	directors: string[],
	credits: string[],
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
	collection: {
		name: string,
	}[],
}
