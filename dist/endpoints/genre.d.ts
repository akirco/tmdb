import { LanguageOption } from '../types';
import { BaseEndpoint } from './base';
export interface Genres {
    genres: Array<{
        id: number;
        name: string;
    }>;
}
export declare class GenreEndpoint extends BaseEndpoint {
    protected readonly accessToken: string;
    constructor(accessToken: string, baseURL?: string);
    movies(options?: LanguageOption): Promise<Genres>;
    tvShows(options?: LanguageOption): Promise<Genres>;
}
