import { Api } from '../api';

export class BaseEndpoint {
  protected api: Api;

  constructor(
    protected readonly accessToken: string,
    baseURL?: string
  ) {
    this.api = new Api(accessToken, baseURL);
  }
}
