import { Api } from '../api';
export declare class BaseEndpoint {
    protected readonly accessToken: string;
    protected api: Api;
    constructor(accessToken: string, baseURL?: string);
}
