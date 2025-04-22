import { AlternativeNames, CompanyDetails, CompanyImages } from './../types/companies';
import { BaseEndpoint } from './base';
export declare class CompaniesEndpoint extends BaseEndpoint {
    protected readonly accessToken: string;
    constructor(accessToken: string, baseURL?: string);
    details(id: number): Promise<CompanyDetails>;
    alternativeNames(id: number): Promise<AlternativeNames>;
    images(id: number): Promise<CompanyImages>;
}
