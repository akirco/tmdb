import { AlternativeTitles, AppendToResponse, AppendToResponseMovieKey, ChangeOption, Changes, Credits, ExternalIds, Images, Keywords, LanguageOption, LatestMovie, MovieChangeValue, MovieDetails, MovieLists, MoviesPlayingNow, PageOption, PopularMovies, Recommendations, RegionOption, ReleaseDates, Reviews, SimilarMovies, TopRatedMovies, Translations, UpcomingMovies, Videos, WatchProviders } from '../types';
import { BaseEndpoint } from './base';
export interface MoviesImageSearchOptions extends LanguageOption {
    /**
     * a list of ISO-639-1 values to query
     */
    include_image_language?: string[];
}
export declare class MoviesEndpoint extends BaseEndpoint {
    protected readonly accessToken: string;
    constructor(accessToken: string, baseURL?: string);
    details<T extends AppendToResponseMovieKey[] | undefined>(id: number, appendToResponse?: T, language?: string): Promise<AppendToResponse<MovieDetails, T, "movie">>;
    alternativeTitles(id: number): Promise<AlternativeTitles>;
    changes(id: number, options?: ChangeOption): Promise<Changes<MovieChangeValue>>;
    credits(id: number, options?: LanguageOption): Promise<Credits>;
    externalIds(id: number): Promise<ExternalIds>;
    images(id: number, options?: MoviesImageSearchOptions): Promise<Images>;
    keywords(id: number): Promise<Keywords>;
    lists(id: number, options?: LanguageOption & PageOption): Promise<MovieLists>;
    recommendations(id: number, options?: LanguageOption & PageOption): Promise<Recommendations>;
    releaseDates(id: number): Promise<ReleaseDates>;
    reviews(id: number, options?: LanguageOption & PageOption): Promise<Reviews>;
    similar(id: number, options?: LanguageOption & PageOption): Promise<SimilarMovies>;
    translations(id: number): Promise<Translations>;
    videos(id: number, options?: LanguageOption): Promise<Videos>;
    /**
     * Powered by JustWatch
     * @param id
     */
    watchProviders(id: number): Promise<WatchProviders>;
    latest(): Promise<LatestMovie>;
    nowPlaying(options?: PageOption & LanguageOption & RegionOption): Promise<MoviesPlayingNow>;
    popular(options?: LanguageOption & PageOption): Promise<PopularMovies>;
    topRated(options?: PageOption & LanguageOption & RegionOption): Promise<TopRatedMovies>;
    upcoming(options?: PageOption & LanguageOption & RegionOption): Promise<UpcomingMovies>;
}
