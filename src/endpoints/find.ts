import { ExternalIdOptions, FindResult } from '../types';
import { BaseEndpoint } from './base';

export class FindEndpoint extends BaseEndpoint {
  constructor(accessToken: string, baseURL?: string) {
    super(accessToken, baseURL);
  }

  async byExternalId(
    id: string,
    options: ExternalIdOptions
  ): Promise<FindResult> {
    return await this.api.get<FindResult>(`/find/${id}`, options);
  }
}
