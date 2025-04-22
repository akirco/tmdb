import { MovieDiscoverResult, MovieQueryOptions, TvShowDiscoverResult, TvShowQueryOptions } from '../types';
import { BaseEndpoint } from './base';
export declare class DiscoverEndpoint extends BaseEndpoint {
    constructor(accessToken: string, baseURL?: string);
    movie(options?: MovieQueryOptions): Promise<MovieDiscoverResult>;
    tvShow(options?: TvShowQueryOptions): Promise<TvShowDiscoverResult>;
}
