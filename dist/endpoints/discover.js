"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoverEndpoint = void 0;
const base_1 = require("./base");
const BASE_DISCOVER = '/discover';
class DiscoverEndpoint extends base_1.BaseEndpoint {
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
    }
    async movie(options) {
        return await this.api.get(`${BASE_DISCOVER}/movie`, options);
    }
    async tvShow(options) {
        return await this.api.get(`${BASE_DISCOVER}/tv`, options);
    }
}
exports.DiscoverEndpoint = DiscoverEndpoint;
//# sourceMappingURL=discover.js.map