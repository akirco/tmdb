import { AppendToResponse, AppendToResponseTvEpisodeKey, ChangeOption, Changes, Episode, EpisodeSelection, ExternalIds, Images, LanguageOption, TvEpisodeCredit, TvEpisodeTranslations, Videos } from '..';
import { BaseEndpoint } from './base';
export interface TvEpisodeImageSearchOptions extends LanguageOption {
    /**
     * a list of ISO-639-1 values to query
     */
    include_image_language?: string[];
}
export interface TvEpisodeVideoSearchOptions extends LanguageOption {
    /**
     * a list of ISO-639-1 values to query
     */
    include_video_language?: string[];
}
export declare class TvEpisodesEndpoint extends BaseEndpoint {
    constructor(accessToken: string, baseURL?: string);
    details<T extends AppendToResponseTvEpisodeKey[] | undefined>(episodeSelection: EpisodeSelection, appendToResponse?: T, options?: LanguageOption): Promise<AppendToResponse<Omit<Episode, "show_id">, T, "tvEpisode">>;
    changes(episodeID: number, options?: ChangeOption): Promise<Changes<unknown>>;
    credits(episodeSelection: EpisodeSelection, options?: LanguageOption): Promise<TvEpisodeCredit>;
    externalIds(episodeSelection: EpisodeSelection): Promise<ExternalIds>;
    images(episodeSelection: EpisodeSelection, options?: TvEpisodeImageSearchOptions): Promise<Images>;
    translations(episodeSelection: EpisodeSelection): Promise<TvEpisodeTranslations>;
    videos(episodeSelection: EpisodeSelection, options?: TvEpisodeVideoSearchOptions): Promise<Videos>;
}
