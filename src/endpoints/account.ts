import { AccountDetails } from '../types/account';
import { BaseEndpoint } from './base';

export class AccountEndpoint extends BaseEndpoint {
  constructor(accessToken: string, baseURL?: string) {
    super(accessToken, baseURL);
  }

  async details(): Promise<AccountDetails> {
    return await this.api.get('/account');
  }
}
