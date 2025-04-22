import { AggregateCredits, AlternativeTitles, AppendToResponse, AppendToResponseTvKey, ChangeOption, Changes, ContentRatings, Credits, EpisodeGroups, ExternalIds, Images, Keywords, LanguageOption, LatestTvShows, OnTheAir, PageOption, PopularTvShows, Recommendations, Reviews, ScreenedTheatrically, SeasonDetails, SimilarTvShows, TimezoneOption, TopRatedTvShows, Translations, TvShowChangeValue, TvShowDetails, TvShowImageOptions, TvShowsAiringToday, TvShowVideoOptions, Videos, WatchProviders } from '../types';
import { BaseEndpoint } from './base';
export declare class TvShowsEndpoint extends BaseEndpoint {
    protected readonly accessToken: string;
    constructor(accessToken: string, baseURL?: string);
    details<T extends AppendToResponseTvKey[] | undefined>(id: number, appendToResponse?: T, language?: string): Promise<AppendToResponse<TvShowDetails, T, "tvShow">>;
    alternativeTitles(id: number): Promise<AlternativeTitles>;
    changes(id: number, options?: ChangeOption): Promise<Changes<TvShowChangeValue>>;
    contentRatings(id: number): Promise<ContentRatings>;
    aggregateCredits(id: number, options?: LanguageOption): Promise<AggregateCredits>;
    credits(id: number, options?: LanguageOption): Promise<Credits>;
    season(tvId: number, seasonNumber: number): Promise<SeasonDetails>;
    episodeGroups(id: number): Promise<EpisodeGroups>;
    externalIds(id: number): Promise<ExternalIds>;
    images(id: number, options?: TvShowImageOptions): Promise<Images>;
    keywords(id: number): Promise<Keywords>;
    recommendations(id: number, options?: LanguageOption & PageOption): Promise<Recommendations>;
    reviews(id: number, options?: LanguageOption & PageOption): Promise<Reviews>;
    screenedTheatrically(id: number): Promise<ScreenedTheatrically>;
    similar(id: number, options?: LanguageOption & PageOption): Promise<SimilarTvShows>;
    translations(id: number): Promise<Translations>;
    videos(id: number, options?: TvShowVideoOptions): Promise<Videos>;
    /**
     * Powered by JustWatch
     * @param id
     */
    watchProviders(id: number): Promise<WatchProviders>;
    latest(): Promise<LatestTvShows>;
    onTheAir(options?: PageOption & LanguageOption & TimezoneOption): Promise<OnTheAir>;
    airingToday(options?: PageOption & LanguageOption & TimezoneOption): Promise<TvShowsAiringToday>;
    popular(options?: PageOption & LanguageOption): Promise<PopularTvShows>;
    topRated(options?: PageOption & LanguageOption): Promise<TopRatedTvShows>;
}
