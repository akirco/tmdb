import { BelongingMovies, Keyword, KeywordsOptions } from '../types';
import { BaseEndpoint } from './base';
export declare class KeywordsEndpoint extends BaseEndpoint {
    constructor(accessToken: string, baseURL?: string);
    details(keywordId: number): Promise<Keyword>;
    /**
     *
     * @deprecated
     */
    belongingMovies(keywordId: number, options?: KeywordsOptions): Promise<BelongingMovies>;
}
