import { AccountDetails } from '../types/account';
import { BaseEndpoint } from './base';
export declare class AccountEndpoint extends BaseEndpoint {
    constructor(accessToken: string, baseURL?: string);
    details(): Promise<AccountDetails>;
}
