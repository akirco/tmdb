import fetch from 'cross-fetch';
import { BASE_URL_V3 } from './common/constants';
import { ErrorResponse } from './types';
import { parseOptions } from './utils';

export class Api {
  private readonly baseURL: string;

  constructor(
    private accessToken: string,
    baseURL?: string
  ) {
    this.accessToken = accessToken;
    this.baseURL = baseURL || BASE_URL_V3;
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  async get<T>(path: string, options?: Record<string, any>): Promise<T> {
    const params = parseOptions(options);
    const response = await fetch(`${this.baseURL}${path}?${params}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    });

    if (!response.ok) {
      return Promise.reject((await response.json()) as ErrorResponse);
    }

    return (await response.json()) as T;
  }
}
