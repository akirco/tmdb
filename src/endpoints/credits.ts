import { CreditResponse } from '../types/credits';
import { BaseEndpoint } from './base';

export class CreditsEndpoint extends BaseEndpoint {
  constructor(
    protected readonly accessToken: string,
    baseURL?: string
  ) {
    super(accessToken, baseURL);
  }

  async getById(id: string): Promise<CreditResponse> {
    return await this.api.get<CreditResponse>(`/credit/${id}`);
  }
}
