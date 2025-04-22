"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TMDB = void 0;
const endpoints_1 = require("./endpoints");
const companies_1 = require("./endpoints/companies");
const networks_1 = require("./endpoints/networks");
class TMDB {
    accessToken;
    baseURL;
    constructor(accessToken, options) {
        this.accessToken = accessToken;
        this.baseURL = options?.baseURL;
    }
    get account() {
        return new endpoints_1.AccountEndpoint(this.accessToken, this.baseURL);
    }
    get configuration() {
        return new endpoints_1.ConfigurationEndpoint(this.accessToken, this.baseURL);
    }
    get certifications() {
        return new endpoints_1.CertificationEndpoint(this.accessToken, this.baseURL);
    }
    get changes() {
        return new endpoints_1.ChangeEndpoint(this.accessToken, this.baseURL);
    }
    get credits() {
        return new endpoints_1.CreditsEndpoint(this.accessToken, this.baseURL);
    }
    get companies() {
        return new companies_1.CompaniesEndpoint(this.accessToken, this.baseURL);
    }
    get networks() {
        return new networks_1.NetworksEndpoint(this.accessToken, this.baseURL);
    }
    get search() {
        return new endpoints_1.SearchEndpoint(this.accessToken, this.baseURL);
    }
    get genres() {
        return new endpoints_1.GenreEndpoint(this.accessToken, this.baseURL);
    }
    get movies() {
        return new endpoints_1.MoviesEndpoint(this.accessToken, this.baseURL);
    }
    get tvShows() {
        return new endpoints_1.TvShowsEndpoint(this.accessToken, this.baseURL);
    }
    get tvEpisode() {
        return new endpoints_1.TvEpisodesEndpoint(this.accessToken, this.baseURL);
    }
    get discover() {
        return new endpoints_1.DiscoverEndpoint(this.accessToken, this.baseURL);
    }
    get people() {
        return new endpoints_1.PeopleEndpoint(this.accessToken, this.baseURL);
    }
    get review() {
        return new endpoints_1.ReviewEndpoint(this.accessToken, this.baseURL);
    }
    get trending() {
        return new endpoints_1.TrendingEndpoint(this.accessToken, this.baseURL);
    }
    get find() {
        return new endpoints_1.FindEndpoint(this.accessToken, this.baseURL);
    }
    get keywords() {
        return new endpoints_1.KeywordsEndpoint(this.accessToken, this.baseURL);
    }
    get collections() {
        return new endpoints_1.CollectionsEndpoint(this.accessToken, this.baseURL);
    }
    get tvSeasons() {
        return new endpoints_1.TvSeasonsEndpoint(this.accessToken, this.baseURL);
    }
    get watchProviders() {
        return new endpoints_1.WatchProvidersEndpoint(this.accessToken, this.baseURL);
    }
}
exports.TMDB = TMDB;
//# sourceMappingURL=tmdb.js.map