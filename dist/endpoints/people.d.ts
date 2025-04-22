import { AppendToResponse, AppendToResponsePersonKey, ChangeOption, Changes, ExternalIds, LanguageOption, PageOption, PeopleImages, PersonChangeValue, PersonCombinedCredits, PersonDetails, PersonMovieCredit, PersonTranslations, PersonTvShowCredit, PopularPeople, TaggedImages } from '../types';
import { BaseEndpoint } from './base';
export declare class PeopleEndpoint extends BaseEndpoint {
    constructor(accessToken: string, baseURL?: string);
    details<T extends AppendToResponsePersonKey[] | undefined>(id: number, appendToResponse?: T, language?: string): Promise<AppendToResponse<PersonDetails, T, "person">>;
    changes(id: number, options?: ChangeOption): Promise<Changes<PersonChangeValue>>;
    movieCredits(id: number, options?: LanguageOption): Promise<PersonMovieCredit>;
    tvShowCredits(id: number, options?: LanguageOption): Promise<PersonTvShowCredit>;
    combinedCredits(id: number, options?: LanguageOption): Promise<PersonCombinedCredits>;
    externalId(id: number): Promise<ExternalIds>;
    images(id: number): Promise<PeopleImages>;
    /**
     * @deprecated
     */
    taggedImages(id: number, options?: PageOption): Promise<TaggedImages>;
    translation(id: number): Promise<PersonTranslations>;
    latest(): Promise<PersonDetails>;
    popular(options?: LanguageOption & PageOption): Promise<PopularPeople>;
}
