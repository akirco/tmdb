"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworksEndpoint = void 0;
const base_1 = require("./base");
class NetworksEndpoint extends base_1.BaseEndpoint {
    accessToken;
    constructor(accessToken, baseURL) {
        super(accessToken, baseURL);
        this.accessToken = accessToken;
    }
    async details(id) {
        return await this.api.get(`/network/${id}`);
    }
    async alternativeNames(id) {
        return await this.api.get(`/network/${id}/alternative_names`);
    }
    async images(id) {
        return await this.api.get(`/network/${id}/images`);
    }
}
exports.NetworksEndpoint = NetworksEndpoint;
//# sourceMappingURL=networks.js.map