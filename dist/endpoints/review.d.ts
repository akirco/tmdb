import { ReviewDetails } from '../types';
import { BaseEndpoint } from './base';
export declare class ReviewEndpoint extends BaseEndpoint {
    constructor(accessToken: string, baseURL?: string);
    details(id: string): Promise<ReviewDetails>;
}
