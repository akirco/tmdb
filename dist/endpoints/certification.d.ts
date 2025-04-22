import { Certifications } from '../types/certification';
import { BaseEndpoint } from './base';
export declare class CertificationEndpoint extends BaseEndpoint {
    protected readonly accessToken: string;
    constructor(accessToken: string, baseURL?: string);
    movies(): Promise<Certifications>;
    tvShows(): Promise<Certifications>;
}
