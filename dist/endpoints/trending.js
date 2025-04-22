"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendingEndpoint = void 0;
const base_1 = require("./base");
class TrendingEndpoint extends base_1.BaseEndpoint {
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
    }
    async trending(mediaType, timeWindow, options) {
        return await this.api.get(`/trending/${mediaType}/${timeWindow}`, options);
    }
}
exports.TrendingEndpoint = TrendingEndpoint;
//# sourceMappingURL=trending.js.map