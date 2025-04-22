"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesEndpoint = void 0;
const base_1 = require("./base");
class CompaniesEndpoint extends base_1.BaseEndpoint {
    accessToken;
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
        this.accessToken = accessToken;
    }
    async details(id) {
        return await this.api.get(`/company/${id}`);
    }
    async alternativeNames(id) {
        return await this.api.get(`/company/${id}/alternative_names`);
    }
    async images(id) {
        return await this.api.get(`/company/${id}/images`);
    }
}
exports.CompaniesEndpoint = CompaniesEndpoint;
//# sourceMappingURL=companies.js.map