"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeywordsEndpoint = void 0;
const base_1 = require("./base");
const BASE_Keyword = '/keyword';
class KeywordsEndpoint extends base_1.BaseEndpoint {
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
    }
    async details(keywordId) {
        return await this.api.get(`${BASE_Keyword}/${keywordId}`);
    }
    /**
     *
     * @deprecated
     */
    async belongingMovies(keywordId, options) {
        return await this.api.get(`${BASE_Keyword}/${keywordId}/movies`, options);
    }
}
exports.KeywordsEndpoint = KeywordsEndpoint;
//# sourceMappingURL=keywords.js.map