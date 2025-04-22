import { LanguageOption, RegionResult, WatchProviderResult, WatchRegionOption } from '../types';
import { BaseEndpoint } from './base';
type ProviderOptions = WatchRegionOption & LanguageOption;
export declare class WatchProvidersEndpoint extends BaseEndpoint {
    protected readonly accessToken: string;
    constructor(accessToken: string, baseURL?: string);
    getRegions(options?: LanguageOption): Promise<RegionResult>;
    getMovieProviders(options?: ProviderOptions): Promise<WatchProviderResult>;
    getTvProviders(options?: ProviderOptions): Promise<WatchProviderResult>;
}
export {};
