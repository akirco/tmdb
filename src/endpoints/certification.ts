import { Certifications } from '../types/certification';
import { BaseEndpoint } from './base';

export class CertificationEndpoint extends BaseEndpoint {
  constructor(
    protected readonly accessToken: string,
    baseURL?: string
  ) {
    super(accessToken, baseURL);
  }

  async movies(): Promise<Certifications> {
    return await this.api.get<Certifications>('/certification/movie/list');
  }

  async tvShows(): Promise<Certifications> {
    return await this.api.get<Certifications>('/certification/tv/list');
  }
}
