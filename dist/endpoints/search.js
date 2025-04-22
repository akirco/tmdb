"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchEndpoint = void 0;
const base_1 = require("./base");
const BASE_SEARCH = '/search';
class SearchEndpoint extends base_1.BaseEndpoint {
    accessToken;
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
        this.accessToken = accessToken;
    }
    async companies(options) {
        return await this.api.get(`${BASE_SEARCH}/company`, options);
    }
    async collections(options) {
        return await this.api.get(`${BASE_SEARCH}/collection`, options);
    }
    async keywords(options) {
        return await this.api.get(`${BASE_SEARCH}/keyword`, options);
    }
    async movies(options) {
        return await this.api.get(`${BASE_SEARCH}/movie`, options);
    }
    async people(options) {
        return await this.api.get(`${BASE_SEARCH}/person`, options);
    }
    async tvShows(options) {
        return await this.api.get(`${BASE_SEARCH}/tv`, options);
    }
    async multi(options) {
        return await this.api.get(`${BASE_SEARCH}/multi`, options);
    }
}
exports.SearchEndpoint = SearchEndpoint;
//# sourceMappingURL=search.js.map