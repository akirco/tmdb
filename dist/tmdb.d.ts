import { AccountEndpoint, CertificationEndpoint, ChangeEndpoint, CollectionsEndpoint, ConfigurationEndpoint, CreditsEndpoint, DiscoverEndpoint, FindEndpoint, GenreEndpoint, KeywordsEndpoint, MoviesEndpoint, PeopleEndpoint, ReviewEndpoint, SearchEndpoint, TrendingEndpoint, TvEpisodesEndpoint, TvSeasonsEndpoint, TvShowsEndpoint, WatchProvidersEndpoint } from './endpoints';
import { CompaniesEndpoint } from './endpoints/companies';
import { NetworksEndpoint } from './endpoints/networks';
export interface TMDBOptions {
    baseURL?: string;
}
export declare class TMDB {
    private readonly accessToken;
    private readonly baseURL?;
    constructor(accessToken: string, options?: TMDBOptions);
    get account(): AccountEndpoint;
    get configuration(): ConfigurationEndpoint;
    get certifications(): CertificationEndpoint;
    get changes(): ChangeEndpoint;
    get credits(): CreditsEndpoint;
    get companies(): CompaniesEndpoint;
    get networks(): NetworksEndpoint;
    get search(): SearchEndpoint;
    get genres(): GenreEndpoint;
    get movies(): MoviesEndpoint;
    get tvShows(): TvShowsEndpoint;
    get tvEpisode(): TvEpisodesEndpoint;
    get discover(): DiscoverEndpoint;
    get people(): PeopleEndpoint;
    get review(): ReviewEndpoint;
    get trending(): TrendingEndpoint;
    get find(): FindEndpoint;
    get keywords(): KeywordsEndpoint;
    get collections(): CollectionsEndpoint;
    get tvSeasons(): TvSeasonsEndpoint;
    get watchProviders(): WatchProvidersEndpoint;
}
