
interface TMDBReleaseDate {
	id: number,
	results: {
		iso_3166_1: string,
		release_dates: {
			certification: string,
			descriptors: [],
			iso_638_1: string,
			note: string,
			release_date: string,
			type: number,
		}[],
	}[],
}
