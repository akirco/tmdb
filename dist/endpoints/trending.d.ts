import { LanguageOption, PageOption, TimeWindow, TrendingMediaType, TrendingResults } from '../types';
import { BaseEndpoint } from './base';
export declare class TrendingEndpoint extends BaseEndpoint {
    constructor(accessToken: string, baseURL?: string);
    trending<T extends TrendingMediaType>(mediaType: T, timeWindow: TimeWindow, options?: LanguageOption & PageOption): Promise<TrendingResults<T>>;
}
