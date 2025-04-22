import { NetworkDetails, NetworkImages } from '..';
import { AlternativeNames } from './../types/companies';
import { BaseEndpoint } from './base';
export declare class NetworksEndpoint extends BaseEndpoint {
    protected readonly accessToken: string;
    constructor(accessToken: string, baseURL?: string);
    details(id: number): Promise<NetworkDetails>;
    alternativeNames(id: number): Promise<AlternativeNames>;
    images(id: number): Promise<NetworkImages>;
}
