import { AggregateCredits, AppendToResponse, AppendToResponseTvSeasonKey, ChangeOption, Changes, Credits, ExternalIds, Images, LanguageOption, SeasonDetails, SeasonSelection, Translations, TvSeasonChangeValue, Videos } from '..';
import { BaseEndpoint } from './base';
export interface TvSeasonImageSearchOptions extends LanguageOption {
    /**
     * a list of ISO-639-1 values to query
     */
    include_image_language?: string[];
}
export interface TvSeasonVideoSearchOptions extends LanguageOption {
    /**
     * a list of ISO-639-1 values to query
     */
    include_video_language?: string[];
}
export declare class TvSeasonsEndpoint extends BaseEndpoint {
    constructor(accessToken: string, baseURL?: string);
    details<T extends AppendToResponseTvSeasonKey[] | undefined>(seasonSelection: SeasonSelection, appendToResponse?: T, options?: LanguageOption): Promise<AppendToResponse<SeasonDetails, T, "tvSeason">>;
    aggregateCredits(seasonSelection: SeasonSelection, options?: LanguageOption): Promise<AggregateCredits>;
    changes(seasonId: number, options?: ChangeOption): Promise<Changes<TvSeasonChangeValue>>;
    credits(seasonSelection: SeasonSelection, options?: LanguageOption): Promise<Credits>;
    externalIds(seasonSelection: SeasonSelection, options?: LanguageOption): Promise<ExternalIds>;
    images(seasonSelection: SeasonSelection, options?: TvSeasonImageSearchOptions): Promise<Images>;
    videos(seasonSelection: SeasonSelection, options?: TvSeasonVideoSearchOptions): Promise<Videos>;
    translations(seasonSelection: SeasonSelection, options?: LanguageOption): Promise<Translations>;
}
