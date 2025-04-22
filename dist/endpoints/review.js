"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewEndpoint = void 0;
const base_1 = require("./base");
class ReviewEndpoint extends base_1.BaseEndpoint {
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
    }
    async details(id) {
        return await this.api.get(`/review/${id}`);
    }
}
exports.ReviewEndpoint = ReviewEndpoint;
//# sourceMappingURL=review.js.map