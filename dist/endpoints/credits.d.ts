import { CreditResponse } from '../types/credits';
import { BaseEndpoint } from './base';
export declare class CreditsEndpoint extends BaseEndpoint {
    protected readonly accessToken: string;
    constructor(accessToken: string, baseURL?: string);
    getById(id: string): Promise<CreditResponse>;
}
