import { CollectionDetails, CollectionImageOptions, ImageCollection, LanguageOption, Translations } from '../types';
import { BaseEndpoint } from './base';
export declare class CollectionsEndpoint extends BaseEndpoint {
    protected readonly accessToken: string;
    constructor(accessToken: string, baseURL?: string);
    details(id: number, options?: LanguageOption): Promise<CollectionDetails>;
    images(id: number, options?: CollectionImageOptions): Promise<ImageCollection>;
    translations(id: number, options?: LanguageOption): Promise<Translations>;
}
