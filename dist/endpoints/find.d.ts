import { ExternalIdOptions, FindResult } from '../types';
import { BaseEndpoint } from './base';
export declare class FindEndpoint extends BaseEndpoint {
    constructor(accessToken: string, baseURL?: string);
    byExternalId(id: string, options: ExternalIdOptions): Promise<FindResult>;
}
