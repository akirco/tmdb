import {
  MovieDiscoverResult,
  MovieQueryOptions,
  TvShowDiscoverResult,
  TvShowQueryOptions,
} from '../types';
import { BaseEndpoint } from './base';

const BASE_DISCOVER = '/discover';

export class DiscoverEndpoint extends BaseEndpoint {
  constructor(accessToken: string, baseURL?: string) {
    super(accessToken, baseURL);
  }

  async movie(options?: MovieQueryOptions): Promise<MovieDiscoverResult> {
    return await this.api.get<MovieDiscoverResult>(
      `${BASE_DISCOVER}/movie`,
      options
    );
  }

  async tvShow(options?: TvShowQueryOptions): Promise<TvShowDiscoverResult> {
    return await this.api.get<TvShowDiscoverResult>(
      `${BASE_DISCOVER}/tv`,
      options
    );
  }
}
