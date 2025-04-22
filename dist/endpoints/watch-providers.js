"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchProvidersEndpoint = void 0;
const base_1 = require("./base");
class WatchProvidersEndpoint extends base_1.BaseEndpoint {
    accessToken;
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
        this.accessToken = accessToken;
    }
    async getRegions(options) {
        return await this.api.get(`/watch/providers/regions`, options);
    }
    async getMovieProviders(options) {
        return await this.api.get(`/watch/providers/movie`, options);
    }
    async getTvProviders(options) {
        return await this.api.get(`/watch/providers/tv`, options);
    }
}
exports.WatchProvidersEndpoint = WatchProvidersEndpoint;
//# sourceMappingURL=watch-providers.js.map