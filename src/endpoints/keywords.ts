import { BelongingMovies, Keyword, KeywordsOptions } from '../types';
import { BaseEndpoint } from './base';

const BASE_Keyword = '/keyword';

export class KeywordsEndpoint extends BaseEndpoint {
  constructor(accessToken: string, baseURL?: string) {
    super(accessToken, baseURL);
  }

  async details(keywordId: number): Promise<Keyword> {
    return await this.api.get<Keyword>(`${BASE_Keyword}/${keywordId}`);
  }

  /**
   *
   * @deprecated
   */
  async belongingMovies(
    keywordId: number,
    options?: KeywordsOptions
  ): Promise<BelongingMovies> {
    return await this.api.get<BelongingMovies>(
      `${BASE_Keyword}/${keywordId}/movies`,
      options
    );
  }
}
