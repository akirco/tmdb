import { Collection, Company, LanguageOption, Movie, PageOption, Person, RegionOption, TV } from '../types';
import { MultiSearchResult, Search } from '../types/search';
import { BaseEndpoint } from './base';
export interface SearchOptions {
    query: string;
    page?: number;
}
export interface MovieSearchOptions extends SearchOptions, LanguageOption, PageOption, RegionOption {
    include_adult?: boolean;
    year?: number;
    primary_release_year?: number;
}
export interface CollectionSearchOptions extends SearchOptions, LanguageOption, PageOption, RegionOption {
    include_adult?: boolean;
}
export interface TvSearchOptions extends SearchOptions, LanguageOption, PageOption {
    include_adult?: boolean;
    year?: number;
    first_air_date_year?: number;
}
export interface PeopleSearchOptions extends SearchOptions, LanguageOption, PageOption {
    include_adult?: boolean;
}
export interface MultiSearchOptions extends SearchOptions, LanguageOption, PageOption {
    include_adult?: boolean;
}
export declare class SearchEndpoint extends BaseEndpoint {
    protected readonly accessToken: string;
    constructor(accessToken: string, baseURL?: string);
    companies(options: SearchOptions): Promise<Search<Company>>;
    collections(options: SearchOptions): Promise<Search<Collection>>;
    keywords(options: SearchOptions): Promise<Search<{
        id: string;
        name: string;
    }>>;
    movies(options: MovieSearchOptions): Promise<Search<Movie>>;
    people(options: PeopleSearchOptions): Promise<Search<Person>>;
    tvShows(options: TvSearchOptions): Promise<Search<TV>>;
    multi(options: MultiSearchOptions): Promise<Search<MultiSearchResult>>;
}
