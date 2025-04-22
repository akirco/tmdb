export declare class Api {
    private accessToken;
    private readonly baseURL;
    constructor(accessToken: string, baseURL?: string);
    get<T>(path: string, options?: Record<string, any>): Promise<T>;
}
