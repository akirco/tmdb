import { ChangeOption, MediaChanges } from '../types';
import { BaseEndpoint } from './base';
export declare class ChangeEndpoint extends BaseEndpoint {
    protected readonly accessToken: string;
    constructor(accessToken: string, baseURL?: string);
    movies(options?: ChangeOption): Promise<MediaChanges>;
    tvShows(options?: ChangeOption): Promise<MediaChanges>;
    person(options?: ChangeOption): Promise<MediaChanges>;
}
