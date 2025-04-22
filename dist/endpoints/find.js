"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindEndpoint = void 0;
const base_1 = require("./base");
class FindEndpoint extends base_1.BaseEndpoint {
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
    }
    async byExternalId(id, options) {
        return await this.api.get(`/find/${id}`, options);
    }
}
exports.FindEndpoint = FindEndpoint;
//# sourceMappingURL=find.js.map