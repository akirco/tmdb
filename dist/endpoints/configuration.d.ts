import { Configuration, CountryConfiguration, JobConfiguration, LanguageConfiguration, TimezoneConfiguration } from '../types/configuration';
import { BaseEndpoint } from './base';
export declare class ConfigurationEndpoint extends BaseEndpoint {
    protected readonly accessToken: string;
    constructor(accessToken: string, baseURL?: string);
    getApiConfiguration(): Promise<Configuration>;
    getCountries(): Promise<CountryConfiguration[]>;
    getLanguages(): Promise<LanguageConfiguration[]>;
    getJobs(): Promise<JobConfiguration[]>;
    getPrimaryTranslations(): Promise<string[]>;
    getTimezones(): Promise<TimezoneConfiguration[]>;
}
